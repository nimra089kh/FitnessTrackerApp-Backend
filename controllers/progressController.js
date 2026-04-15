const Progress = require("../models/Progress")

// GET /api/progress — all entries
async function getProgress(req, res) {
  try {
    const entries = await Progress.find({ user: req.user.id }).sort({ date: 1 })
    res.json(entries)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}

// POST /api/progress — add entry
async function addProgress(req, res) {
  try {
    const { date, weight, bodyFat, chest, waist, hips, arms, benchPress, squat, deadlift, runTime } = req.body
    const entry = await Progress.create({
      user: req.user.id,
      date: date || new Date().toISOString().split("T")[0],
      weight, bodyFat, chest, waist, hips, arms, benchPress, squat, deadlift, runTime
    })
    res.status(201).json(entry)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}

// DELETE /api/progress/:id
async function deleteProgress(req, res) {
  try {
    const entry = await Progress.findOneAndDelete({ _id: req.params.id, user: req.user.id })
    if (!entry) return res.status(404).json({ message: "Not found" })
    res.json({ message: "Deleted" })
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}

module.exports = { getProgress, addProgress, deleteProgress }