const mongoose = require("mongoose")

const ExerciseSchema = new mongoose.Schema({
  name:   { type: String, required: true, trim: true },
  sets:   { type: Number, required: true, min: 1 },
  reps:   { type: Number, required: true, min: 1 },
  weight: { type: Number, default: 0, min: 0 },
  unit:   { type: String, enum: ["lbs", "kg"], default: "lbs" },
})

const WorkoutSchema = new mongoose.Schema(
  {
    user:      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name:      { type: String, required: [true, "Workout name required"], trim: true },
    category:  { type: String, required: true, enum: ["strength", "cardio", "hiit", "flexibility"] },
    exercises: { type: [ExerciseSchema], default: [] },
    notes:     { type: String, default: "", trim: true },
    date:      { type: String, default: () => new Date().toISOString().split("T")[0] },
    duration:  { type: Number, required: true, min: 1 },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Workout", WorkoutSchema)