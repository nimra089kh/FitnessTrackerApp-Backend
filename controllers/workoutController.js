const Workout = require("../models/workout")

// GET /api/workouts
const getWorkouts = async (req, res, next) => {
  try {
    const { category, search } = req.query
    const filter = { user: req.user.id }   // ← sirf is user ke workouts

    if (category && category !== "all") filter.category = category
    if (search) filter.name = { $regex: search, $options: "i" }

    const workouts = await Workout.find(filter).sort({ createdAt: -1 })
    res.status(200).json({ success: true, count: workouts.length, data: workouts })
  } catch (error) { next(error) }
}

// GET /api/workouts/:id
const getWorkout = async (req, res, next) => {
  try {
    const workout = await Workout.findOne({ _id: req.params.id, user: req.user.id })
    if (!workout) return res.status(404).json({ success: false, error: "Workout not found" })
    res.status(200).json({ success: true, data: workout })
  } catch (error) { next(error) }
}

// POST /api/workouts
const createWorkout = async (req, res, next) => {
  try {
    const { name, category, exercises, notes, date, duration, completed } = req.body
    const workout = await Workout.create({
      user: req.user.id,   // ← user attach karo
      name, category,
      exercises: exercises || [],
      notes: notes || "",
      date: date || new Date().toISOString().split("T")[0],
      duration,
      completed: completed || false,
    })
    res.status(201).json({ success: true, data: workout })
  } catch (error) { next(error) }
}

// PUT /api/workouts/:id
const updateWorkout = async (req, res, next) => {
  try {
    const workout = await Workout.findOne({ _id: req.params.id, user: req.user.id })
    if (!workout) return res.status(404).json({ success: false, error: "Workout not found" })

    const updated = await Workout.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    res.status(200).json({ success: true, data: updated })
  } catch (error) { next(error) }
}

// DELETE /api/workouts/:id
const deleteWorkout = async (req, res, next) => {
  try {
    const workout = await Workout.findOne({ _id: req.params.id, user: req.user.id })
    if (!workout) return res.status(404).json({ success: false, error: "Workout not found" })

    await workout.deleteOne()
    res.status(200).json({ success: true, message: "Workout deleted", id: req.params.id })
  } catch (error) { next(error) }
}

module.exports = { getWorkouts, getWorkout, createWorkout, updateWorkout, deleteWorkout }