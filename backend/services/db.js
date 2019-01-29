const config = require("../../config")
const mongojs = require("mongojs")
const collections = ['users'];

const { user, password, clusterString, database, options } = config.db
const queryParams = Object.keys(options).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(options[k])}`).join('&')
const mongoUrl = `mongodb://${user}:${password}@${clusterString}/${database}?${queryParams}`
const db = mongojs(mongoUrl, collections)

module.exports = {
    db,
    mongoUid: mongojs.ObjectID
}