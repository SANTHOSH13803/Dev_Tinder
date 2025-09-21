const express = require("express");
const conectDatabase = require("./config/database");
const User = require("./models/user");
const app = express();

app.post("/signup", async (req, res) => {
  const user = {
    firstName: "Ram",
    lastName: "Veluru",
    age: 27,
    emailId: "RamVeluru@gmail.com",
    password: "ramv13803"
  };
  //  creating a new instance
  const newUser = new User(user);
  await newUser.save();
  res.send("User created");
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
