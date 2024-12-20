const express = require("express");
const router = require("./routers/index.js")
const dotenv = require("dotenv");
const cors = require("cors")
dotenv.config({
    path: "./config/env/config.env"
})
const mongodb_connection = require("./midlewares/connect_mongodb.js")
const app = express()
mongodb_connection()
const PORT = process.env.PORT;
app.use(express.json())
app.use(cors())

app.use("/api", router)


app.listen(PORT, () => {
    console.log("server live at port", PORT, "Node environment=", process.env.NODE_ENV)
})