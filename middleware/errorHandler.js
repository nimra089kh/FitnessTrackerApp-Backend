// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error("❌ Error:", err.message)

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message)
    return res.status(400).json({ success: false, error: messages.join(", ") })
  }

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    return res.status(400).json({ success: false, error: "Invalid workout ID" })
  }

  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Server Error",
  })
}

module.exports = errorHandler
