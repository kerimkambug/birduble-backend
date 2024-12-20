const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User.js")
const Cocktail = require("../models/cocktail");

const router = express.Router();

// Token doğrulama işlemi (directly in routes)
const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ success: false, message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Token'dan gelen kullanıcı bilgilerini req.user'a ekliyoruz
        next(); // İstek devam etsin
    } catch (error) {
        res.status(401).json({ success: false, message: "Invalid token" });
    }
};

// Register user
const register = async (req, res) => {
    try {
        const { name, username, email, password, ingredients } = req.body;

        // Kullanıcıyı oluştur
        const user = await User.create({
            name,
            username,
            email,
            password,
            ingredients,
        });

        // Şifreyi hash'leyerek gönderiyoruz
        user.password = undefined; // Şifreyi istemciye göndermiyoruz

        // Token oluştur
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: { name: user.name, username: user.username, email: user.email },
            token, // Token'ı da döndürüyoruz
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// Login user
const login = async (req, res) => {
    try {
        const { email, username, password } = req.body;

        let user;

        // Email veya kullanıcı adı ile kullanıcıyı bul
        if (email) {
            user = await User.findOne({ email }).select("+password");
        } else if (username) {
            user = await User.findOne({ username }).select("+password");
        }

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Şifreyi kontrol et
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // Token oluştur
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.status(200).json({
            success: true,
            message: "Login successful",
            token, // Token'ı döndürüyoruz
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get my profile (token authentication required)
const getMyProfile = async (req, res) => {
    try {

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get profile by username
const getProfileByName = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Request password reset (send reset token)
const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Burada şifre sıfırlama token'ı oluşturulabilir
        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.status(200).json({
            success: true,
            message: "Password reset email sent", // Gerçek uygulama için e-posta gönderimi eklenebilir
            resetToken, // Şifre sıfırlama token'ı döndürülebilir
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get available cocktails based on user's ingredients
const getAvailableCocktails = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const { ingredients } = user;
        console.log(ingredients);

        // Kullanıcıda bulunan malzemelerle tam olarak eşleşen kokteylleri bul
        const cocktails = await Cocktail.find();

        // Kokteylleri kullanıcıda bulunan malzemelere göre filtrele
        const availableCocktails = cocktails.filter(cocktail => {
            // Her kokteylin malzemeleri
            const cocktailIngredients = cocktail.ingredients.map(item => item.ingredient);

            // Eğer kokteylin malzemelerinin hepsi kullanıcının malzemeleriyle eşleşiyorsa
            return cocktailIngredients.every(ingredient => ingredients.includes(ingredient));
        });

        res.status(200).json({
            success: true,
            message: "Available cocktails fetched",
            data: availableCocktails,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Update profile (token authentication required)
const updateProfile = async (req, res) => {
    try {
        const updates = req.body;
        const user = await User.findByIdAndUpdate(req.user.id, updates, {
            new: true,
            runValidators: true,
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    register,
    login,
    getMyProfile,
    getProfileByName,
    requestPasswordReset,
    getAvailableCocktails,
    updateProfile,
    verifyToken
};
