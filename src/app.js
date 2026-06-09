const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const dns = require("dns");
const jwt = require("jsonwebtoken");

const User = require("./models/user"); // USER MODEL
const conectDatabase = require("./config/database");
const { validateOnSignUp } = require("./utils/validators");
const userAuth = require("./middlewares/userAuth");

dns.setServers(["1.1.1.1", "8.8.8.8"]);

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  const user = req.body;
  try {
    // validtions
    validateOnSignUp(req);
    // Encrypt password
    const hashPassword = await bcrypt.hash(user.password, 10);

    //  creating a new instance
    const newUser = new User({ ...user, password: hashPassword });
    await newUser.save();
    res.send("User created");
  } catch (error) {
    res.status(500).send("Something went wrong : " + error);
  }
});
app.post("/login", async (req, res) => {
  try {
    // validtions
    const { emailId, password } = req.body;
    // validate emailId
    if (!validator.isEmail(emailId)) {
      throw new Error("Not a valid email Id");
    }

    //get  Encrypt password from DB
    const dbUser = await User.findOne({ emailId });
    if (!dbUser) {
      throw new Error("Email Not registered");
    }
    // use bcrypt compare method to validate password
    const hashPassword = dbUser?.password;
    const isValidPassword = await dbUser.validatePassword(password);

    if (isValidPassword) {
      // if true send response
      const token = await dbUser.getJwt(); // custom User Method
      res.cookie("token", token);
      res.send("Logged In successfully");
    } else {
      // if false throw error
      throw new Error("Password Entered is not valid");
    }
  } catch (error) {
    res.status(500).send("Something went wrong : " + error);
  }
});

app.get("/user", async (req, res) => {
  const userMail = req.body.emailId;
  try {
    const user = await User.findOne({ emailId: userMail });
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const allUsers = await User.find({});
    res.send(allUsers);
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      throw new Error("User Not found");
    }

    res.send(user);
  } catch (error) {
    res.status(500).send("Something went wrong" + error);
  }
});
app.put("/user", async (req, res) => {
  try {
    const body = req.body;
    const userID = body.userId; // take this from params

    await User.findByIdAndUpdate(userID, body);

    res.send("User Updated Successfully!");
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});
app.delete("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    // 1. finding the user
    const user = await User.findOne({ emailId: userEmail });

    if (!user) {
      return res.status(404).send("User not found");
    }

    // deleting by userId

    const userId = user._id;
    const deleteRes = await User.findByIdAndDelete(userId);

    res.send("User Deleted Successfully");
  } catch (error) {
    return res.status(500).send("Something went wrong");
  }
});

app.patch("/user", async (req, res) => {
  try {
    const body = req.body;
    const userID = body.userId; // take this from params

    const ALLOWED_FEILDS = [
      "firstName",
      "lastName",
      "about",
      "skills",
      "userId"
    ];
    const isAllowed = Object.keys(body).every((key) =>
      ALLOWED_FEILDS.includes(key)
    );
    if (!isAllowed) {
      throw new Error("Cannot Update user");
    }

    await User.findByIdAndUpdate(userID, body);

    res.send("User Updated Successfully!");
  } catch (error) {
    res.status(500).send("Something went wrong " + error.message);
  }
});

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
