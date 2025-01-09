const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  priority: { type: Number, required: true, min: 1, max: 5 },
  status: { type: String, enum: ["Pending", "Finished"], default: "pending" },
  taskId: { type: Number, required: true },
});


module.exports = mongoose.model("Task", taskSchema);
