const express = require("express")
const path = require("path")
const router = express.Router()

router.get("/", (req, res) => {
    console.log("Test Controller base path called")
    res.sendFile(path.resolve(`${__dirname}/../views/index.html`))
})

module.exports = router