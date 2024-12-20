const Ingredient = require("../models/ingredients");  // Ingredient modelini içe aktar

// Add a new ingredient
const addIngredient = async (req, res) => {
    try {
        const { name, category } = req.body;

        // Validate that name and category exist
        if (!name || !category) {
            return res.status(400).json({
                success: false,
                message: "Name and category are required"
            });
        }

        // Check if the ingredient already exists
        const existingIngredient = await Ingredient.findOne({ name });
        if (existingIngredient) {
            return res.status(400).json({
                success: false,
                message: "Ingredient already exists"
            });
        }

        // Create a new ingredient
        const ingredient = await Ingredient.create({ name, category });

        res.status(201).json({
            success: true,
            message: "Ingredient added successfully",
            data: ingredient
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all ingredients
const getAllIngredients = async (req, res) => {
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

// Update an ingredient by name
const updateIngredient = async (req, res) => {
    try {
        const { name } = req.params;
        const updates = req.body;

        // Update the ingredient
        const ingredient = await Ingredient.findOneAndUpdate({ name }, updates, {
            new: true,
            runValidators: true
        });

        if (!ingredient) {
            return res.status(404).json({
                success: false,
                message: "Ingredient not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Ingredient updated successfully",
            data: ingredient
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Delete an ingredient by name
const deleteIngredient = async (req, res) => {
    try {
        const { name } = req.params;

        // Delete the ingredient
        const ingredient = await Ingredient.findOneAndDelete({ name });

        if (!ingredient) {
            return res.status(404).json({
                success: false,
                message: "Ingredient not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Ingredient deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    addIngredient,
    getAllIngredients,
    updateIngredient,
    deleteIngredient
};
