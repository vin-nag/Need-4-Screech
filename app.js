const express = require("express")
const controllers = require("./controllers")

const app = express()
app.use(controllers)
app.listen(3000, () => console.log("Running on port 3000..."))