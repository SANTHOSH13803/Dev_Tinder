const adminAuth = (req, res, next) => {
  console.log("Admin Middleware");
  const token = "xyz";
  const isAdminAuthorized = token === "xyz";
  if (!isAdminAuthorized) {
    res.status(401).send("Unauthorized user");
  }
  next();
};
const userAuth = (req, res, next) => {
  console.log("User Middleware");
  const token = "xyz";
  const isUserAuthorized = token === "xyz";
  if (!isUserAuthorized) {
    res.status(401).send("Unauthorized user");
  }
  next();
};

module.exports = { adminAuth, userAuth };
