const express = require("express")
const router = express.Router()
const testController = require("./test")

router.use("/", testController) // domain/
router.use("/test", testController) // domain/test

module.exports = router