const validator = require("validator");

const validateOnSignUp = (req) => {
  const { firstName, lastName, password, emailId } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("emailID is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Enter Strong Password");
  }
};

module.exports = { validateOnSignUp };
