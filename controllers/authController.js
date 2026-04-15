const User = require("../models/User");
const jwt = require("jsonwebtoken");
const Workout   = require("../models/workout");
const MealEntry = require("../models/MealEntry");
const Progress  = require("../models/Progress");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

const userResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  age: user.age,
  gender: user.gender,
  height: user.height,
  weight: user.weight,
  goalWeight: user.goalWeight,
  goal: user.goal,
  fitnessGoal: user.fitnessGoal,
  profilePic: user.profilePic,
  plan: user.plan,
});

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: "Fields are empty" });
    if (password.length < 6)
      return res.status(400).json({ success: false, message: "Password must be atleast 6 characters" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ success: false, message: "Email already registered" });

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);
    res.status(201).json({ success: true, message: "Account created successfully!", token, user: userResponse(user) });
  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email aur password are required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ success: false, message: "Invalid credentials" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = generateToken(user._id);
    res.json({ success: true, message: "Login successful!", token, user: userResponse(user) });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ success: true, user: userResponse(user) });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, email, age, height, weight, goalWeight, gender, goal, fitnessGoal } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, age, height, weight, goalWeight, gender, goal, fitnessGoal },
      { new: true, runValidators: true }
    ).select("-password");
    res.json({ success: true, message: "Profile updated!", user: userResponse(updatedUser) });
  } catch (error) {
    console.error("Update profile error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const uploadProfilePic = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ success: false, message: "Koi file nahi mili" });

    const profilePic = `http://localhost:5000/uploads/${req.file.filename}`;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id, { profilePic }, { new: true }
    ).select("-password");
    res.json({ success: true, message: "Profile picture update ho gaya!", user: userResponse(updatedUser) });
  } catch (error) {
    console.error("Upload pic error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ success: false, message: "Dono passwords required hain" });
    if (newPassword.length < 6)
      return res.status(400).json({ success: false, message: "New password kam se kam 6 characters ka hona chahiye" });

    const user = await User.findById(req.user.id);
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch)
      return res.status(401).json({ success: false, message: "Current password galat hai" });

    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: "Password successfully change ho gaya!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateSettings = async (req, res) => {
  try {
    const { notifications, preferences } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id, { notifications, preferences }, { new: true }
    ).select("-password");
    res.json({ success: true, message: "Settings save ho gayi!", user: userResponse(updatedUser) });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @route DELETE /api/auth/delete-account
const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password)
      return res.status(400).json({ success: false, message: "Password required hai confirmation ke liye" });

    const user = await User.findById(req.user.id);
    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: "Password galat hai" });

    const userId = req.user.id;

    // ── Pehle sare data delete karo (cascade) ──
    await Promise.all([
      Workout.deleteMany({ user: userId }),
      MealEntry.deleteMany({ user: userId }),
      Progress.deleteMany({ user: userId }),
    ]);

    // ── Phir user delete karo ──
    await User.findByIdAndDelete(userId);

    res.json({ success: true, message: "Account aur sab data delete ho gaya" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  register, login, getMe, updateProfile, uploadProfilePic,
  changePassword, updateSettings, deleteAccount,
};