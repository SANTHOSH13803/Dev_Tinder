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

dns.setServers(["1.1.1.1", "8.8.8.8"]);
const clientUrl =
  process.env.NODE_ENV === "production"
    ? process.env.CLIENT_URL
    : "http://localhost:5173";
app.use(
  cors({
    origin: clientUrl,
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

conectDatabase()
  .then(() => {
    console.log("Database connected");

    app.listen(3000, () => {
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
