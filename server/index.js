const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const user = require("./routes/userRoute");
const chat = require("./routes/chatRoute");
const message = require("./routes/messageRoute");

const app = express();
require("dotenv").config();

app.use(express.json());
app.use(cors());

app.use("/api/users", user);
app.use("/api/chats", chat);
app.use("/api/messages", message);

const port = process.env.PORT || 5000;
const mongodb_uri = process.env.MONGODB_URI;
app.listen(port, (req, res) => {
  console.log(`Server running on port ${port}... `);
});

mongoose
  .connect(mongodb_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB...");
  })
  .catch((error) => {
    console.log("Mongodb connection error: ", error);
  });
