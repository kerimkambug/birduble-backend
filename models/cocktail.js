const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CocktailSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please provide a cocktail name"]
  },
  ingredients: [{
    ingredient: { type: String, required: true }, // Ingredient adı
    amount: { type: String, required: true }     // Ingredient miktarı
  }],
  recipe: {
    type: String,
    required: [true, "Please provide cocktail recipe"]
  }
}, { timestamps: true });

const Cocktail = mongoose.model("Cocktail", CocktailSchema);

module.exports = Cocktail;
