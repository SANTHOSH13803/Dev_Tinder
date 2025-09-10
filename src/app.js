const express = require("express");
const adminRoutes = require("./routes/admin");
const app = express();

app.use("/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Home page");
});
app.get("/about", (req, res) => {
  res.send("About page");
});
app.post("/about", (req, res) => {
  res.send("About page Post api");
});
app.put("/about", (req, res) => {
  res.send("About page Put api");
});
app.patch("/about", (req, res) => {
  res.send("About page Patch api");
});
app.delete("/about", (req, res) => {
  res.send("About page Delete api");
});
app.head("/about", (req, res) => {
  res.send("About page Head api");
});
app.options("/about", (req, res) => {
  res.send("About page Options api");
});
// app.use((req, res, next) => {
//   res.send("Hello World!");
// });
app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("Internal Server Error " + err.message);
  }
});
app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
