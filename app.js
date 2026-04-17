const { PORT = 3001 } = process.env;
const express = require("express");
const mongoose = require("mongoose");
const { router } = require("./routes/index");
const app = express();
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to wtwr_db");
  })
  .catch((error) => console.error(error));

app.use((req, res, next) => {
  req.user = {
    _id: "69e19b37a142f5ce7bd05068",
  };
  next();
});
app.use("/", router);

app.listen(PORT, () => {
  console.log(
    `Server is running on port ${PORT} ${new Date().toLocaleTimeString()}`
  );
});
