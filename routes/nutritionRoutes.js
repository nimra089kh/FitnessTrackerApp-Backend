const express = require("express");
const router = express.Router();
const { getMealsByDate, createMealEntry, deleteMealEntry, getWeeklyData, getDailySummary } = require("../controllers/nutritionController");
const { protect } = require("../middleware/authMiddleware");

router.get("/weekly",  protect, getWeeklyData);
router.get("/summary", protect, getDailySummary);
router.get("/",        protect, getMealsByDate);
router.post("/",       protect, createMealEntry);
router.delete("/:id",  protect, deleteMealEntry);

module.exports = router;
