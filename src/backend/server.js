const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const router = require("./routes/router");
app.use(bodyParser.json());

app.use("/api", router);

app.listen(8080, () => {
  console.log("Server started on port 8080...");
});
