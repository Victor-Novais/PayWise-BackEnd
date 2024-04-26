require("dotenv").config({ path: require("find-config")(".env") });

const express = require("express");
const app = express();
const cors = require("cors");
const router = require("./router");

app.use(cors());
app.use(express.json());
app.use("/v1", router);

app.listen(3000);
