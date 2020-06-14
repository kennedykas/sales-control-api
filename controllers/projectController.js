const express = require('express')
const authMiddeleware = require('../src/middelewares/auth.js')

const router = express.Router()

router.use(authMiddeleware)

router.get('/', (req, res) => {
    res.send({ ok: true })
})

module.exports = app => app.use('/projects', router)