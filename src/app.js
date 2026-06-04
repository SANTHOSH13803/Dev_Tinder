const express = require("express");
const conectDatabase = require("./config/database");
const User = require("./models/user"); // USER MODEL
const app = express();

const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = req.body;
  try {
    // Validation
    const REQUIRED_FIELDS = ["emailId", "password"];

    if (!user?.emailId || !user?.password) {
      throw new Error("User Credentials required");
    }

    //  creating a new instance
    const newUser = new User(user);
    await newUser.save();
    res.send("User created");
  } catch (error) {
    console.log(error);
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
