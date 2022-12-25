const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Please provide company name"],
      maxlength: 50,
    },
    company_description: { type: String, maxlength: 200 },
    position: {
      type: String,
      required: [true, "Please provide company name"],
      maxlength: 50,
    },
    position_activities: { type: String, maxlength: 200 },
    position_privileges: { type: String, maxlength: 200 },
    working_hours: {
      type: Number,
      min: 1,
      max: 24,
      required: [true, "Provide working hours"],
    },
    salary: {
      type: Number,
      min: 1,
      required: [true, "Provide salary"],
    },
    requirements: { type: String, maxlength: 200 },
    status: {
      type: String,
      default: "pending",
      enum: ["interview", "declined", "pending"],
    },
    posted_by: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Job creator not provided"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", JobSchema);
