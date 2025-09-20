const mongoose = require("mongoose");

async function connectDatabase() {
  await mongoose.connect(
    "mongodb+srv://santhosh13803:9K1t6qAmvAUb63EA@cluster0.hdpr79y.mongodb.net/devTinder"
  );
}

module.exports = connectDatabase;
