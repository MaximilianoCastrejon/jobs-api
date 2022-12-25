require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");
const authenticate = require("./middleware/authentication");

// security packages middleware
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

//Uncomment for hosters with reverse proxy
// app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowsMs: 20 * 60 * 1000,
    max: 200,
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

// extra packages

const connectDB = require("./db/connect");

// routes
app.use("/api/auth", authRouter);
app.use("/api/jobs", authenticate, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
