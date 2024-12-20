const express = require("express");
const {
    addCocktail,
    getAllCocktails,
    getCocktailByName,
    updateCocktail,
    deleteCocktail,
    getingredients
} = require("../controllers/cocktail");
const router = express.Router();

// Add a new cocktail
router.post("/addcocktail", addCocktail);

// Get all cocktails
router.get("/getallcocktails", getAllCocktails);

// Get a cocktail by name
router.get("/getcocktail/:name", getCocktailByName);

// Update a cocktail by name
router.put("/updatecocktail/:name", updateCocktail);

// Delete a cocktail by name
router.delete("/deletecocktail/:name", deleteCocktail);
router.get("/getingredients", getingredients)
module.exports = router;
