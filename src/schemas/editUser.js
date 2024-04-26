const joi = require("joi");

const editUserSchema = joi.object({
  username: joi.string(),
  email: joi.string().email().messages({
    "string.email": "O campo email precisa ter um formato válido",
  }),
  cpf: joi.string().optional().allow("").min(11).allow(null).messages({
    "string.min": "O CPF precisa conter, no mínimo, 11 caracteres",
  }),
  phone: joi.string().optional().allow("").min(11).allow(null).messages({
    "string.min": "O Telefone precisa conter, no mínimo, 11 caracteres",
  }),
  password: joi.string().min(5).allow(null).allow("").messages({
    "string.min": "A senha precisa conter, no mínimo, 5 caracteres",
  }),
});

module.exports = editUserSchema;
