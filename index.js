const express = require("express");
const dotenv = require("dotenv");

const DbConnection= require("./databaseConnection");   

const { users } = require("./data/users.json");
const app = express();
const port = 8081;

const userRouter = require("./routes/users");
const bookRouter = require("./routes/books");

dotenv.config();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server is running",
  });
});
app.use("/users", userRouter);

app.use("/books", bookRouter);
const { user } = require("./data/users.json");

app.get("*", (req, res) => {
  res.status(404).json({
    message: "This  route doesn't exist",
  });
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
