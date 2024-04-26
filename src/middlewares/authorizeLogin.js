const jwt = require("jsonwebtoken");
const knex = require("../config/knex.conf");

async function authorizeLogin(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: "Não autorizado" });
  }

  try {
    const token = authorization.replace("Bearer ", "").trim();

    const { id } = jwt.verify(token, process.env.JWT_PASS);

    const userExists = await knex("users").where({ id }).first();

    if (!userExists) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const { password, ...user } = userExists;

    req.user = user;

    next();
  } catch (error) {
    return res.status(400).json({ message: "Não autorizado" });
  }
}

module.exports = authorizeLogin;
