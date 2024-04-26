const joi = require("joi");

const loginSchema = joi.object({
  email: joi.string().email().required().messages({
    "any.required": "O campo email é obrigatório ",
    "string.email": "O campo email precisa ter um formato válido",
  }),
  password: joi.string().min(5).required().messages({
    "any.required": "O campo Senha é obrigatório ",
    "string.min": "A senha precisa conter, no mínimo, 5 caracteres",
  }),
});

module.exports = loginSchema;
