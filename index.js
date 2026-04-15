
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ===== Middleware =====
app.use(cors());
app.use(express.json());
const path = require("path")
// ===== Routes =====
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/workouts", require("./routes/workoutRoutes")); 
app.use("/api/nutrition", require("./routes/nutritionRoutes"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")))
const progressRoutes = require("./routes/progressRoutes")
app.use("/api/progress", progressRoutes)
// ===== Test Route =====
app.get("/", (req, res) => {
  res.json({ message: "FitnessTracker API running" });
});

// ===== MongoDB Connect + Server Start =====
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    console.log(" MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} `);
    });
  })
  .catch((err) => {
    console.error(" MongoDB not connectted:", err.message);
    process.exit(1);
  });