const express = require("express");
const conectDatabase = require("./config/database");
const User = require("./models/user");
const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = req.body;
  try {
    //  creating a new instance
    const newUser = new User(user);
    await newUser.save();
    res.send("User created");
  } catch (error) {
    console.log(error);
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
