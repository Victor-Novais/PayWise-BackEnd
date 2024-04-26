const axios = require("axios");

module.exports = axios.create({
  baseURL: "https://viacep.com.br/ws/",
  headers: { "Content-Type": "application/json" },
  timeout: 5000,
});
