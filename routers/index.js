const express = require("express");
const auth = require("./auth")
const cocktail = require("./cocktail");
const ingredient = require("./ingredient");
const router = express.Router()
router.use("/auth", auth);
router.use("/ingredient", ingredient)
router.use("/cocktail", cocktail)


module.exports = router;