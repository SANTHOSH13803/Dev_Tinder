const express = require("express");
const app = express();
const router = express.Router();
const { adminAuth, userAuth } = require("../middlewares/adminAuth");
// router.use("/", (req, res, next) => {
//   console.log("Admin Middleware");
//   const token = "xyz";
//   const isAdminAuthorized = token === "xyz";
//   if (!isAdminAuthorized) {
//     res.status(401).send("Unauthorized user");
//   }
//   next();
// });

router.use("/", adminAuth);

router.get("/user", userAuth, (req, res, next) => {
  res.send("User in Admin Route");
});
router.get("/getData", (req, res) => {
  res.send("Admin Data Sent");
});

router.get("/deteteUser", (req, res) => {
  res.send("Admin Deleted a user");
});

module.exports = router;
