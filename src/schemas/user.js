const joi = require("joi");

const userSchema = joi.object({
  username: joi.string().required().messages({
    "any.required": "O campo Nome é obrigatório ",
  }),
  email: joi.string().email().required().messages({
    "any.required": "O campo email é obrigatório ",
    "string.email": "O campo email precisa ter um formato válido",
  }),
  password: joi.string().min(5).required().messages({
    "any.required": "O campo Senha é obrigatório ",
    "string.min": "A senha precisa conter, no mínimo, 5 caracteres",
  }),
  cpf: joi.string().optional().allow("").min(11).messages({
    "string.min": "O CPF precisa conter, no mínimo, 11 caracteres",
  }),
  phone: joi.string().min(11).messages({
    "string.min": "O Telefone precisa conter, no mínimo, 11 caracteres",
  }),
});

module.exports = userSchema;
