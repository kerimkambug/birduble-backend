const express = require("express");
const {
    addIngredient,
    getAllIngredients,
    updateIngredient,
    deleteIngredient
} = require("../controllers/ingredient");

const router = express.Router();

// Route: Add a new ingredient
router.post("/addingredient", addIngredient);

// Route: Get all ingredients
router.get("/getallingredients", getAllIngredients);

// Route: Update an ingredient by name
router.put("/updateingredient/:name", updateIngredient);

// Route: Delete an ingredient by name
router.delete("/deleteingredient/:name", deleteIngredient);

module.exports = router;
