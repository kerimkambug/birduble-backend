const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const IngredientSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please provide the ingredient name"],
    unique: true  // Her malzeme adı benzersiz olacak
  },
  category: {
    type: String,
    default: "other",
    enum: [
      "alkol",
      "sebze",
      "soft",
      "baharat",
      "meyve",
      "şurup",
      "sos",
      "diğer"
    ]
  }
}, { timestamps: true });

const Ingredient = mongoose.model("Ingredient", IngredientSchema);

module.exports = Ingredient;
