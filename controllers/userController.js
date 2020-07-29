const express = require('express')
const authMiddeleware = require('../src/middelewares/auth.js')
const router = express.Router()
const User = require('../models/user')
const Bill = require('../models/customerBill')
router.use(authMiddeleware)

router.get('/user', async (req, res) => {
    try {
        if (req.query.id) {
            const user = await User.findOne({ _id: req.query.id })
            return res.status(200).send(user)
        }
        const page = req.query.page
        const limit = parseInt(req.query.limit)
            const skip = limit * (page - 1)
        await User.find().skip(skip).limit(limit).exec((err, user) => {
            if (err) throw err
            return res.status(200).send(user)
        })
    } catch (err) {
        return res.status(400).send({ error: 'Error loding users.' })
    }
})

router.post('/user', async (req, res) => {
    try {
        if (req.body.name && !await User.findOne({ name: req.body.name })) {
            await User.create({
                name: req.body.name,
                phone: req.body.phone,
                email: req.body.email
            })
            return res.status(200).send({ success: 'User created.' })
        } else return res.status(406).send({ error: 'Name user already exist.' })
    } catch (err) { return res.status(400).send({ error: err }) }
})

router.put('/user', async (req, res) => {
    try {
        if (req.body.name) {
            await User.updateOne({ _id: req.body._id }, {
                name: req.body.name,
                phone: req.body.phone,
                email: req.body.email
            })
            return res.status(200).send({ success: 'User changed.' })
        } else return res.status(406).send({ error: 'Name cannot be empty' })
    } catch (err) { return res.status(400).send({ error: err }) }
})

router.delete('/user', async (req, res) => {
    try {
        if (!await Bill.findOne({ customer: req.body._id, billPaymentDate: null })) {
            await User.deleteOne({ _id: req.body._id })
            return res.status(200).send({ success: 'User deleted.' })
        }
        return res.status(409).send({ error: 'The client is registered in an open invoice.' })
    } catch (err) { return res.status(400).send({ error: err }) }
})

module.exports = app => app.use('/api', router)
