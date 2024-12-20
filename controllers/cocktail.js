const Cocktail = require("../models/cocktail");
const Ingredient = require("../models/ingredients");

// Add a new cocktail
const addCocktail = async (req, res) => {
    try {
        const { name, ingredients, recipe } = req.body;

        // Validate that name, ingredients, and recipe exist
        if (!name || !ingredients || !recipe) {
            return res.status(400).json({
                success: false,
                message: "Name, ingredients, and recipe are required"
            });
        }

        // Check if the cocktail with the same name already exists
        const existingCocktail = await Cocktail.findOne({ name });

        if (existingCocktail) {
            return res.status(400).json({
                success: false,
                message: "Cocktail with this name already exists"
            });
        }

        // Create a new cocktail
        const cocktail = await Cocktail.create({ name, ingredients, recipe });

        res.status(201).json({
            success: true,
            message: "Cocktail added successfully",
            data: cocktail
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// Get all cocktails
const getAllCocktails = async (req, res) => {
    try {
        const cocktails = await Cocktail.find();
        res.status(200).json({
            success: true,
            data: cocktails
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get ingredients
const getingredients = async (req, res) => {
    try {
        const ingredients = await Ingredient.find();
        res.status(200).json({
            success: true,
            data: ingredients
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get a cocktail by name
const getCocktailByName = async (req, res) => {
    try {
        const { name } = req.params;
        const cocktail = await Cocktail.findOne({ name });

        if (!cocktail) {
            return res.status(404).json({
                success: false,
                message: "Cocktail not found"
            });
        }

        res.status(200).json({
            success: true,
            data: cocktail
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update a cocktail
const updateCocktail = async (req, res) => {
    try {
        const { name } = req.params;
        const updates = req.body;

        // Validate that updates are provided
        if (!updates || Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No update data provided"
            });
        }

        const cocktail = await Cocktail.findOneAndUpdate({ name }, updates, {
            new: true,
            runValidators: true
        });

        if (!cocktail) {
            return res.status(404).json({
                success: false,
                message: "Cocktail not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Cocktail updated successfully",
            data: cocktail
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Delete a cocktail
const deleteCocktail = async (req, res) => {
    try {
        const { name } = req.params;
        const cocktail = await Cocktail.findOneAndDelete({ name });

        if (!cocktail) {
            return res.status(404).json({
                success: false,
                message: "Cocktail not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Cocktail deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    addCocktail,
    getAllCocktails,
    getCocktailByName,
    updateCocktail,
    deleteCocktail,
    getingredients
};
