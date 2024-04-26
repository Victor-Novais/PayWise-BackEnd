const knex = require("../config/knex.conf");
const { format } = require("date-fns");
const cpfValidate = require("../util/cpfValidate");

async function registerClient(req, res) {
  const user_id = req.user.id;
  const {
    name,
    email,
    cpf,
    phone,
    zipcode,
    street,
    complement,
    neighborhood,
    city,
    state,
  } = req.body;

  try {
    const emailExists = await knex("clients").where({ email }).first();
    if (emailExists) {
      return res.status(400).json({ message: "O email já está cadastrado" });
    }

    const validCPF = cpfValidate(cpf);

    if (!validCPF) {
      return res.status(400).json({ message: "CPF inválido" });
    }

    const clientCPFExists = await knex("clients").where({ cpf }).first();

    if (clientCPFExists) {
      return res.status(400).json({ message: "O CPF já existe" });
    }

    const newClient = await knex("clients")
      .insert({
        user_id,
        name,
        email,
        cpf: validCPF,
        phone,
        zipcode,
        street,
        complement,
        neighborhood,
        city,
        state,
      })
      .returning("*");

    if (!newClient) {
      return res.status(400).json({ message: "O cliente não foi cadastrado" });
    }

    const { user_id: _, ...client } = newClient[0];

    return res
      .status(201)
      .json({ message: "Cliente cadastrado com sucesso!", client });
  } catch (error) {
    return res.status(400).json({ message: "Erro ao registrar o cliente" });
  }
}

async function getClients(req, res) {
  const user_id = req.user.id;
  let { per_page, current_page, defaulter } = req.query;

  if (!per_page) per_page = 10;
  if (!current_page) current_page = 1;

  const offset = current_page === 1 ? 0 : (current_page - 1) * per_page;

  if (defaulter && !["true", "false"].includes(defaulter))
    return res.status(400).json({ message: "Status do cliente inválido" });

  try {
    await knex.raw("SELECT update_client_status();");
    const clients = await knex("clients")
      .where({ user_id })
      .modify(function (queryBuilder) {
        if (typeof defaulter !== "undefined") queryBuilder.where({ defaulter });
      })
      .offset(offset)
      .limit(per_page);

    return res.status(200).json({ clients });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Erro ao listar os clientes" });
  }
}

async function editClient(req, res) {
  const { id } = req.params;
  const {
    name,
    email,
    cpf,
    phone,
    zipcode,
    street,
    complement,
    neighborhood,
    city,
    state,
  } = req.body;

  try {
    const existingClient = await knex("clients").where({ id }).first();

    if (!existingClient) {
      return res.status(404).json({ message: "Cliente não encontrado" });
    }

    const updatedClient = await knex("clients")
      .where({ id })
      .update({
        name,
        email,
        cpf,
        phone,
        zipcode,
        street,
        complement,
        neighborhood,
        city,
        state,
      })
      .returning("*");

    return res.status(200).json({
      message: "Cliente atualizado com sucesso",
      client: updatedClient,
    });
  } catch (error) {
    return res.status(400).json({ message: "Erro ao atualizar o cliente" });
  }
}

async function detailClient(req, res) {
  const { id } = req.params;

  try {
    const existingClient = await knex("clients").where({ id }).first();

    if (!existingClient) {
      return res.status(404).json({ message: "Cliente não encontrado" });
    }

    const client_id = existingClient.id;
    await knex.raw("SELECT update_charge_status();");
    const chargesDB = await knex("charges").select("*").where({ client_id });

    const charges = chargesDB.map((charge) => {
      charge.id_pt = String(charge.id).padStart(9, "0");

      charge.amount_pt = charge.amount / 100;
      charge.amount_pt = charge.amount_pt.toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL",
      });

      charge.due_date_pt = format(charge.due_date, "dd/MM/yyyy");

      if (charge.status === "paid") {
        charge.status_pt = "Paga";
      } else if (charge.status === "overdue") {
        charge.status_pt = "Vencida";
      } else {
        charge.status_pt = "Pendente";
      }

      return charge;
    });

    return res.status(200).json({ existingClient, charges });
  } catch (error) {
    return res.status(400).json({ message: "Erro ao detalhar o cliente" });
  }
}

module.exports = {
  registerClient,
  getClients,
  editClient,
  detailClient,
};
