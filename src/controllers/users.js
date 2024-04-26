const knex = require("../config/knex.conf");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cpfValidate = require("../util/cpfValidate");

async function registerUser(req, res) {
  const { username, email, password } = req.body;

  try {
    const userCount = await knex("users").where({ email }).first();

    if (userCount) {
      return res.status(400).json({ message: "O email já está cadastrado" });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const newUser = await knex("users")
      .insert({
        username,
        email,
        password: encryptedPassword,
      })
      .returning("*");

    if (!newUser) {
      return res.status(400).json({ message: "O usuário não foi cadastrado" });
    }

    const { password: _, ...user } = newUser[0];

    return res.status(201).json({ user });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function userEmailExists(req, res) {
  const { email } = req.body;

  try {
    const user = await knex("users").where({ email }).first();

    if (!user) {
      return res.status(404).json({ exists: false });
    }

    return res.status(200).json({ exists: true });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await knex("users").where({ email }).first();

    if (!user) {
      return res.status(404).json({ message: "Usuario não encontrado" });
    }

    const passwordOK = await bcrypt.compare(password, user.password);

    if (!passwordOK) {
      return res.status(400).json({ message: "Senha incorreta" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_PASS, {
      expiresIn: "8h",
    });

    const { password: _, ...userData } = user;

    return res.status(200).json({
      user: userData,
      token,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function editUser(req, res) {
  let { username, email, cpf, phone, password } = req.body;
  const { id, cpf: currentCPF } = req.user;

  try {
    const userExists = await knex("users").where({ id }).first();

    if (!userExists) {
      return res.status(404).json({ message: "Usuario não encontrado" });
    }

    if (cpf && cpf !== currentCPF) {
      cpf = cpfValidate(cpf);

      if (!cpf) {
        return res.status(400).json({ message: "CPF inválido" });
      }

      const userCPFExists = await knex("users").where({ cpf }).first();

      if (userCPFExists) {
        return res.status(400).json({ message: "O CPF já existe" });
      }
    }

    if (password) {
      password = await bcrypt.hash(password, 10);
    }

    if (email && email !== req.user.email) {
      const userEmailExists = await knex("users").where({ email }).first();

      if (userEmailExists) {
        return res.status(400).json({ message: "O email já existe" });
      }
    }

    const userUpdated = await knex("users")
      .where({ id })
      .update({
        username,
        email,
        cpf,
        phone,
        password,
      })
      .returning("*");

    if (!userUpdated) {
      return res.status(400).json({ message: "O usuario não foi atualizado" });
    }

    const { password: _, ...user } = userUpdated[0];

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

module.exports = {
  registerUser,
  userEmailExists,
  login,
  editUser,
};
