const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const taskRouter = require("./routes/task");

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use("/tasks", taskRouter);

const dbUrl = "mongodb://127.0.0.1:27017/taskmateDB";
mongoose
  .connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Database connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Welcome to TaskMate");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
