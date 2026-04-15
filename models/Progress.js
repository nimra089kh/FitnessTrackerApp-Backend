const mongoose = require("mongoose")

const progressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date:      { type: String, required: true },
  weight:    { type: Number },
  bodyFat:   { type: Number },
  chest:     { type: Number },
  waist:     { type: Number },
  hips:      { type: Number },
  arms:      { type: Number },
  benchPress:{ type: Number },
  squat:     { type: Number },
  deadlift:  { type: Number },
  runTime:   { type: Number },
}, { timestamps: true })

module.exports = mongoose.model("Progress", progressSchema)