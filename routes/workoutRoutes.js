const express = require("express")
const router = express.Router()
const { getWorkouts, getWorkout, createWorkout, updateWorkout, deleteWorkout } = require("../controllers/workoutController")
const { protect } = require("../middleware/authMiddleware")

router.route("/").get(protect, getWorkouts).post(protect, createWorkout)
router.route("/:id").get(protect, getWorkout).put(protect, updateWorkout).delete(protect, deleteWorkout)

module.exports = router