require("dotenv").config();
const { PORT = 3001 } = process.env;
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { router } = require("./routes/index");
const errorHandler = require("./middlewares/error-handler");
const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();
app.use(cors());
app.use(express.json());

app.use(requestLogger);
app.use("/", router);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

const startServer = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");
    console.log("Connected to wtwr_db");

    app.listen(PORT, () => {
      console.log(
        `Server is running on port ${PORT} ${new Date().toLocaleTimeString()}`
      );
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

startServer();
