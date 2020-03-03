const express = require("express");
const bodyParser = require("body-parser");

const router = require("./routes/router");
const app = express();

app.use(bodyParser.json());
app.use("/api", router);

app.listen(8080, () => {
  console.log("Server started on port 8080...");
});
