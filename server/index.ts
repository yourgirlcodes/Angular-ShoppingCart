const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const app = express();
const { setup } = require("./wooCommerce");

app.use(bodyParser.json());

const cors = require("cors");
app.use(cors({ origin: "*" }));

app.get("/api/status", function (req, res) {
  res.status(200).json({ status: "UP" });
});

setup(app);

https
  .createServer(
    {
      key: fs.readFileSync("../ssl/key.pem", "utf8"),
      cert: fs.readFileSync("../ssl/cert.pem", "utf8"),
    },
    app
  )
  .listen(3001, () => {
    console.log("Running on port 3001");
  });
