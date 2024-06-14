const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    chatId: String,
    senderID: String,
    text: String,
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
