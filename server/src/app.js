require("dotenv").config();
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const dns = require("dns");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const User = require("./models/user"); // USER MODEL
const conectDatabase = require("./config/database");
const { validateOnSignUp } = require("./utils/validators");
const userAuth = require("./middlewares/userAuth");

// cron-jobs
require("./utils/cron-jobs/cron-jobs");
//
// Socket.io
const { createServer } = require("http");
const initializeSocket = require("./utils/socket");

dns.setServers(["1.1.1.1", "8.8.8.8"]);
const allowedOrigins = [
  "http://localhost:5173",
  "https://dev-tinder-teal.vercel.app",
  process.env.CLIENT_URL
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true
  })
);

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const photoRouter = require("./routes/photo");
const { transporter } = require("./utils/sendEmail");
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/photo", photoRouter);

// socket initialization
const httpServer = createServer(app);
initializeSocket(httpServer);
//
conectDatabase()
  .then(() => {
    console.log("Database connected");

    httpServer.listen(3000, () => {
      console.log("Example app listening on port 3000!");
    });
  })
  .catch((err) => {
    console.log(err);
  });

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Email server is ready");
  }
});
