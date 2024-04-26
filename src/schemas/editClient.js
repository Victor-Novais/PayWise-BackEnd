const Joi = require("joi");

const clientSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "O campo Nome é obrigatório",
  }),
  email: Joi.string().email().required().messages({
    "any.required": "O campo Email é obrigatório",
    "string.email": "O campo Email precisa ter um formato válido",
  }),
  cpf: Joi.string().min(11).required().messages({
    "any.required": "O campo CPF é obrigatório",
    "string.min": "O CPF precisa conter, no mínimo, 11 caracteres",
  }),
  phone: Joi.string().optional().allow("").min(9).required().messages({
    "any.required": "O campo Telefone é obrigatório",
    "string.min": "O Telefone precisa conter, no mínimo, 11 caracteres",
  }),
  zipcode: Joi.string().optional().allow(""),
  street: Joi.string().optional().allow(""),
  complement: Joi.string().optional().allow(""),
  neighborhood: Joi.string().optional().allow(""),
  city: Joi.string().optional().allow(""),
  state: Joi.string().optional().allow(""),
  defaulter: Joi.string().valid("paid", "pending", "overdue"),
});

module.exports = clientSchema;
