const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    email:       { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:    { type: String, required: true, minlength: 6 },
    profilePic:  { type: String, default: "" },
    age:         { type: Number, default: null },
    gender:      { type: String, enum: ["male", "female", "other", ""], default: "" },
    height:      { type: Number, default: null },
    weight:      { type: Number, default: null },
    goalWeight:  { type: Number, default: null },
    goal:        { type: String, default: "improve_fitness" },
    plan:        { type: String, enum: ["free", "pro"], default: "free" },

    // Settings
    notifications: {
      workoutReminders:  { type: Boolean, default: true },
      mealReminders:     { type: Boolean, default: true },
      goalAlerts:        { type: Boolean, default: true },
      weeklyReport:      { type: Boolean, default: true },
      pushNotifications: { type: Boolean, default: false },
    },
    preferences: {
      units:    { type: String, enum: ["imperial", "metric"], default: "imperial" },
      theme:    { type: String, enum: ["dark", "light", "system"], default: "dark" },
      language: { type: String, default: "en" },
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);