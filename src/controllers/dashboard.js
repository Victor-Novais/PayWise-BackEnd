const knex = require("../config/knex.conf");
const { format } = require("date-fns");

async function getChargeStats(user_id, status) {
  const total = await knex.raw("SELECT get_total_charges(?, ?);", [
    user_id,
    status,
  ]);

  const count = await knex.raw("SELECT get_count_charges(?, ?);", [
    user_id,
    status,
  ]);

  const charges = await knex("charges")
    .join("clients", "clients.id", "charges.client_id")
    .join("users", "users.id", "clients.user_id")
    .select("clients.name", "charges.id", "charges.amount")
    .where({ user_id, status })
    .limit(4);

  const stats = {};

  stats.total = (total.rows[0]["get_total_charges"] ?? 0) / 100;
  stats.total = stats.total.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });

  stats.count = count.rows[0]["get_count_charges"] ?? 0;
  stats.charges = charges.map((charge) => {
    charge.id_pt = String(charge.id).padStart(9, "0");
    charge.first_name = charge.name.split(" ")[0];
    charge.amount_pt = charge.amount / 100;
    charge.amount_pt = charge.amount_pt.toLocaleString("pt-br", {
      style: "currency",
      currency: "BRL",
    });

    return charge;
  });

  return stats;
}

async function getClientsByDefaulter(user_id, defaulter) {
  const clients = await knex("clients")
    .select("clients.name", "clients.id", "clients.cpf")
    .where({ user_id, defaulter })
    .limit(4);

  clients.map((client) => {
    client.id_pt = String(client.id).padStart(9, "0");
    return client;
  });

  const count = clients.length;

  return { count, clients };
}

async function getDashboard(req, res) {
  const user_id = req.user.id;
  const dashboard = {};

  try {
    await knex.raw("SELECT update_client_status();");

    dashboard.pastDueCharges = await getChargeStats(user_id, "overdue");
    dashboard.expectedCharges = await getChargeStats(user_id, "pending");
    dashboard.paidCharges = await getChargeStats(user_id, "paid");
    dashboard.defaulterClients = await getClientsByDefaulter(user_id, true);
    dashboard.onTimeClients = await getClientsByDefaulter(user_id, false);

    return res.status(200).json(dashboard);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Erro ao carregar dados do dashboard" });
  }
}

module.exports = { getDashboard };
