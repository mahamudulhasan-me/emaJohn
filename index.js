const express = require("express");
const cors = require("cors");
const mainRoute = require("./Router/Main");

const app = express();
const port = process.env.PORT || 4040;

// middleware
app.use(cors());
app.use(express.json());

app.use("/", mainRoute);

app.listen(port, () => {
  console.log("Ema John is now listening on port", port);
});
