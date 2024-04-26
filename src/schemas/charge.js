const Joi = require("joi").extend(require("@joi/date"));

const chargeSchema = Joi.object({
  client_id: Joi.number(),
  description: Joi.string().required().messages({
    "any.required": "O campo Descrição é obrigatório",
  }),
  status: Joi.string().valid("paid", "pending", "overdue").messages({
    "any.required": "O campo Descrição é obrigatório",
  }),
  amount: Joi.number().required().messages({
    "any.required": "O campo Valor é obrigatório",
  }),
  due_date: Joi.date().format("YYYY-MM-DD").utc().required().messages({
    "any.required": "O campo Vencimento é obrigatório",
  }),
});

module.exports = chargeSchema;
