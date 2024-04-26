const router = require("express").Router();

const users = require("./controllers/users");
const clients = require("./controllers/clients");
const charges = require("./controllers/charges");

const { getAddressByCEP } = require("./controllers/cep");
const { getDashboard } = require("./controllers/dashboard");

const authorizeLogin = require("./middlewares/authorizeLogin");
const requestBodyValidate = require("./middlewares/requestBodyValidate");

const userSchema = require("./schemas/user");
const userEmailExistsSchema = require("./schemas/userEmailExists");
const loginSchema = require("./schemas/login");
const editUserSchema = require("./schemas/editUser");
const cepSchema = require("./schemas/cep");
const clientSchema = require("./schemas/client");
const editClientSchema = require("./schemas/editClient");
const chargeSchema = require("./schemas/charge");
const chargeEditSchema = require("./schemas/editCharge");

router.get("/queries/cep", requestBodyValidate(cepSchema), getAddressByCEP);

router.post(
  "/users/email",
  requestBodyValidate(userEmailExistsSchema),
  users.userEmailExists
);
router.post("/users", requestBodyValidate(userSchema), users.registerUser);
router.post("/users/login", requestBodyValidate(loginSchema), users.login);

router.use(authorizeLogin);

router.get("/dashboard", getDashboard);

router.patch("/users", requestBodyValidate(editUserSchema), users.editUser);

router.post(
  "/clients",
  requestBodyValidate(clientSchema),
  clients.registerClient
);
router.patch(
  "/clients/:id",
  requestBodyValidate(editClientSchema),
  clients.editClient
);

router.get("/client/:id", clients.detailClient);

router.get("/clients", clients.getClients);

router.post(
  "/charges",
  requestBodyValidate(chargeSchema),
  charges.registerCharge
);

router.patch(
  "/charges/:id",
  requestBodyValidate(chargeEditSchema),
  charges.editCharge
);

router.delete("/charges/:id", charges.deleteCharge);

router.get("/charges", charges.getCharges);

module.exports = router;
