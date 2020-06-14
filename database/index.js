const db = require('mongoose')

db.connect('mongodb://localhost/noderest', { useNewUrlParser: true, useUnifiedTopology: true })
db.Promise = global.Promise

module.exports = db
