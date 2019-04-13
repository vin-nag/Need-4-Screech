const config = require("../../config")
const mongojs = require("mongojs")

const { user, password, clusterString, database, options } = config.db
const queryParams = Object.keys(options).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(options[k])}`).join('&')

const mongoUrl = (user != null && password != null) ? 
                 `mongodb://${user}:${password}@${clusterString}/${database}?${queryParams}` :
                 `mongodb://${clusterString}/${database}?${queryParams}`
                 
const db = mongojs(mongoUrl, ['users', 'levels'])

module.exports = {
    db,
    mongoUid: mongojs.ObjectID
}
