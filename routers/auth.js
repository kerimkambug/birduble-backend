const express = require("express");
const router = express.Router();
const {
    register,
    login,
    getMyProfile,
    getProfileByName,
    requestPasswordReset,
    getAvailableCocktails,
    updateProfile,
    verifyToken
} = require("../controllers/auth");

// Route: Register
router.post("/register", register);

// Route: Login
router.post("/login", login);

// Route: Get my profile (Token authentication required)
router.get("/profile", verifyToken, getMyProfile);  // Token doğrulama burada yapılacak

// Route: Update profile (Token authentication required)
router.put("/updateprofile", verifyToken, updateProfile);  // Token doğrulama burada yapılacak

// Route: Get profile by username
router.get("/profile/:username", getProfileByName);

// Route: Request password reset
router.post("/resetpassword", requestPasswordReset);

// Route: Get available cocktails (Token authentication required)
router.get("/getAvailableCocktails", verifyToken, getAvailableCocktails);

module.exports = router;
