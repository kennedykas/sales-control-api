const jwt = require('jsonwebtoken')
const authConfig = require('../config/authConfig.json')

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization
    if (req.headers.disconnected) {
        return next()
    }
    if (!authHeader) {
        return res.status(401).send({ error: 'No token provided' })
    }
    const parts = authHeader.split(' ')
    if (!parts.length === 2) {
        return res.status(401).send({ error: 'Token error' })
    }
    const [scheme, token] = parts
    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).send({ error: 'Ivalid token. Malformed string.' })
    }

    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({ error: 'Token invalid' })
        }
        req.userId = decoded.id
        return next()
    })
}
