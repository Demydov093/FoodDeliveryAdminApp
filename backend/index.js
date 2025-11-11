require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const crypto = require("crypto");

const categoryRoutes = require("./routes/categories");
const logger = require("./utils/logger");
const { errorHandler } = require("./middlewares/errorHandler");

const app = express();

app.use(helmet());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests",
  })
);

app.use(cors({ origin: "http://localhost:3000" }));

app.use(express.json());
app.use(bodyParser.raw({ type: "application-json" }));

app.use(errorHandler);

app.listen(5000, () => logger.info("Server running on http://localhost:5000"));
