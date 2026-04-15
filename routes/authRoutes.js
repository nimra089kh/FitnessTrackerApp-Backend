const express = require("express");
const router = express.Router();
const { register, login, getMe, updateProfile , uploadProfilePic,  changePassword, updateSettings, deleteAccount } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/multerMiddleware");

// POST /api/auth/register  → naya account banao
router.post("/register", register);

// POST /api/auth/login  → login karo
router.post("/login", login);

// GET /api/auth/me  → apni info dekho (token chahiye)
router.get("/me", protect, getMe);

router.put("/update-profile", protect, updateProfile);

router.post("/upload-pic", protect, upload.single("profilePic"), uploadProfilePic);
router.put("/change-password", protect, changePassword);
router.put("/update-settings", protect, updateSettings);
router.delete("/delete-account", protect, deleteAccount);
module.exports = router;