const db = require('mongoose')

db.connect(`${process.env.MONGO_URL}`, { useNewUrlParser: true, useUnifiedTopology: true })
db.Promise = global.Promise

module.exports = db
