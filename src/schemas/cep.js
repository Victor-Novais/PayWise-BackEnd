const joi = require("joi");

const cepSchema = joi.object({
  cep: joi.string().min(8).required().messages({
    "any.required": "O campo CEP é obrigatório ",
    "string.min": "O CEP precisa conter, no mínimo, 8 caracteres",
  }),
});

module.exports = cepSchema;
