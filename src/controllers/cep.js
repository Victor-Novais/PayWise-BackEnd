const viaCEP = require("../config/axios.conf");

async function getAddressByCEP(req, res) {
  let { cep } = req.body;

  try {
    const response = await viaCEP.get(`/${cep}/json/`);

    const { cep: zipCode, logradouro, bairro, localidade, uf } = response.data;

    if (!zipCode) {
      return res.status(404).json({ message: "CEP não encontrado" });
    }

    const address = {
      streetName: logradouro,
      neighborhood: bairro,
      zipCode,
      city: localidade,
      state: uf,
    };

    return res.status(200).json(address);
  } catch (error) {
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
}

module.exports = {
  getAddressByCEP,
};
