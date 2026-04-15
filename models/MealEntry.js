const mongoose = require("mongoose");

const FoodItemSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  quantity: { type: String, default: "", trim: true },
  calories: { type: Number, min: 0, default: 0 },
  protein:  { type: Number, min: 0, default: 0 },
  carbs:    { type: Number, min: 0, default: 0 },
  fat:      { type: Number, min: 0, default: 0 },
});

const MealEntrySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: {
      type: String, required: true,
      match: [/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"],
    },
    mealType: {
      type: String, required: true,
      enum: ["breakfast", "lunch", "dinner", "snack"],
    },
    foods: {
      type: [FoodItemSchema],
      validate: { validator: (f) => f.length > 0, message: "At least one food required" },
    },
  },
  { timestamps: true }
);

MealEntrySchema.index({ user: 1, date: 1 });

module.exports = mongoose.model("MealEntry", MealEntrySchema);