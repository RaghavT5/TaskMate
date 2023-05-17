const mongoose = require("mongoose");

const taskmateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

const Task = mongoose.model("Task", taskmateSchema);

module.exports = Task;
