const MealEntry = require("../models/MealEntry");

// GET /api/nutrition?date=2026-03-04  OR  /api/nutrition (sab data)
const getMealsByDate = async (req, res) => {
  try {
    const { date } = req.query;
    const query = { user: req.user.id };   // ← sirf is user ki meals
    if (date) query.date = date;

    const entries = await MealEntry.find(query).sort({ createdAt: -1 });

    const totals = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    entries.forEach((entry) => {
      entry.foods.forEach((f) => {
        totals.calories += f.calories;
        totals.protein  += f.protein;
        totals.carbs    += f.carbs;
        totals.fat      += f.fat;
      });
    });

    res.status(200).json({ success: true, date, totals, count: entries.length, data: entries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/nutrition
const createMealEntry = async (req, res) => {
  try {
    const { date, mealType, foods } = req.body;

    if (!date || !mealType || !foods || foods.length === 0)
      return res.status(400).json({ success: false, message: "date, mealType, and foods are required" });

    const validFoods = foods.filter((f) => f.name && f.name.trim() !== "");
    if (validFoods.length === 0)
      return res.status(400).json({ success: false, message: "At least one food item with a name is required" });

    const entry = await MealEntry.create({
      user: req.user.id,   // ← user attach karo
      date, mealType, foods: validFoods
    });
    res.status(201).json({ success: true, message: "Meal logged successfully", data: entry });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/nutrition/:id
const deleteMealEntry = async (req, res) => {
  try {
    const entry = await MealEntry.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!entry) return res.status(404).json({ success: false, message: "Meal entry not found" });

    res.status(200).json({ success: true, message: "Meal entry deleted", data: { id: req.params.id } });
  } catch (error) {
    if (error.name === "CastError")
      return res.status(400).json({ success: false, message: "Invalid meal entry ID" });
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/nutrition/weekly?date=2026-03-04
const getWeeklyData = async (req, res) => {
  try {
    const { date } = req.query;
    const endDate = date ? new Date(date) : new Date();
    const days = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(endDate);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
      days.push({ dateStr, dayName });
    }

    const dateStrings = days.map((d) => d.dateStr);
    const entries = await MealEntry.find({ user: req.user.id, date: { $in: dateStrings } });

    const caloriesByDate = {};
    entries.forEach((entry) => {
      if (!caloriesByDate[entry.date]) caloriesByDate[entry.date] = 0;
      entry.foods.forEach((food) => { caloriesByDate[entry.date] += food.calories; });
    });

    const weeklyData = days.map(({ dateStr, dayName }) => ({
      day: dayName, date: dateStr,
      calories: caloriesByDate[dateStr] || 0,
    }));

    res.status(200).json({ success: true, data: weeklyData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/nutrition/summary?date=2026-03-04
const getDailySummary = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ success: false, message: "Date is required" });

    const entries = await MealEntry.find({ user: req.user.id, date });
    const totals = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    entries.forEach((entry) => {
      entry.foods.forEach((f) => {
        totals.calories += f.calories;
        totals.protein  += f.protein;
        totals.carbs    += f.carbs;
        totals.fat      += f.fat;
      });
    });

    res.status(200).json({ success: true, date, data: totals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getMealsByDate, createMealEntry, deleteMealEntry, getWeeklyData, getDailySummary };