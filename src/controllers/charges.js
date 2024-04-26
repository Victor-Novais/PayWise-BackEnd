const knex = require("../config/knex.conf");
const { format } = require("date-fns");

async function registerCharge(req, res) {
  const { client_id, description, status, amount, due_date } = req.body;

  try {
    const client = await knex("clients").where({ id: client_id }).first();

    if (!client) {
      return res.status(404).json({ message: "Cliente não encontrado" });
    }

    const newCharge = await knex("charges")
      .insert({
        client_id,
        description,
        status,
        amount,
        due_date,
      })
      .returning("*");

    if (!newCharge) {
      return res.status(400).json({ message: "A cobrança não foi cadastrada" });
    }

    const { client_id: _, ...charge } = newCharge[0];

    return res.status(201).json({ charge });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function getCharges(req, res) {
  const user_id = req.user.id;
  let { per_page, current_page, status } = req.query;

  if (!per_page) per_page = 10;
  if (!current_page) current_page = 1;

  const offset = current_page === 1 ? 0 : (current_page - 1) * per_page;

  if (status && !["paid", "pending", "overdue"].includes(status))
    return res.status(400).json({ message: "Status da cobrança inválido" });

  try {
    await knex.raw("SELECT update_charge_status();");
    const chargesDB = await knex("charges")
      .join("clients", "clients.id", "charges.client_id")
      .select("charges.*", "clients.name as client_name")
      .where({ user_id })
      .modify(function (queryBuilder) {
        if (status) queryBuilder.where({ status });
      })
      .offset(offset)
      .limit(per_page);

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

    return res.status(200).json({ charges });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Erro ao listar as cobranças" });
  }
}

async function editCharge(req, res) {
  const { id } = req.params;
  const updateDetails = req.body;

  try {
    const existingCharge = await knex("charges").where({ id }).first();

    if (!existingCharge) {
      return res.status(404).json({ message: "Cobrança não encontrada" });
    }

    const updatedCharge = await knex("charges")
      .where({ id })
      .update(updateDetails)
      .returning("*");

    return res.status(200).json({
      message: "Cobrança atualizada com sucesso",
      charge: updatedCharge,
    });
  } catch (error) {
    return res.status(400).json({ message: "Erro ao atualizar a cobrança" });
  }
}

async function deleteCharge(req, res) {
  const { id } = req.params;

  try {
    const existingCharge = await knex("charges").where({ id }).first();
    if (!existingCharge) {
      return res.status(404).json({ message: "Cobrança não encontrada" });
    }

    if (existingCharge.status !== "pending") {
      return res.status(400).json({
        message:
          "A cobrança não pode ser excluída devido ao status ou data de vencimento inválida.",
      });
    }

    await knex("charges").where({ id }).del();

    return res.status(200).json({ message: "Cobrança excluída com sucesso" });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao excluir a cobrança" });
  }
}

module.exports = { registerCharge, getCharges, editCharge, deleteCharge };
