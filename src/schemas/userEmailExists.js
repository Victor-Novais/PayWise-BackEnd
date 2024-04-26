const joi = require("joi");

const userEmailExistsSchema = joi.object({
  email: joi.string().email().required().messages({
    "any.required": "O campo email é obrigatório ",
    "string.email": "O campo email precisa ter um formato válido",
  }),
});

module.exports = userEmailExistsSchema;
