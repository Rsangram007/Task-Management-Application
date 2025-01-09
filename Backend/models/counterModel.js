const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  taskId: { type: Number, default: 0 },
});

const Counter = mongoose.model("Counter", counterSchema);
module.exports = Counter;
