const Joi = require("joi").extend(require("@joi/date"));

const chargeEditSchema = Joi.object({
  description: Joi.string().messages({
    "string.base": "A descrição deve ser uma string",
    "string.empty": "A descrição não pode estar vazia",
  }),
  status: Joi.string().valid("paid", "pending", "overdue").messages({
    "any.only": "O status deve ser 'paid', 'pending' ou 'overdue'",
  }),
  amount: Joi.number().messages({
    "number.base": "O valor deve ser um número",
  }),
  due_date: Joi.date().format("YYYY-MM-DD").utc().messages({
    "date.base": "A data de vencimento deve estar no formato YYYY-MM-DD",
  }),
});

module.exports = chargeEditSchema;
