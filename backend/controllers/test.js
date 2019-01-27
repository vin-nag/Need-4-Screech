const express = require("express")
const path = require("path")
const { db, mongoUid } = require("../services/db")

const router = express.Router()

router.get("/", (req, res) => {
    console.log("Test Controller base path called")

    db.test.findOne({
        _id: mongoUid('5c48e9171c9d4400000b5499')
    }, function(err, doc) {
        console.log(doc)
        if(err) console.error(err)
    })

    res.sendFile(path.resolve(`${__dirname}/../../frontend/views/index.html`))
})

module.exports = router