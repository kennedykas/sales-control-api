const express = require('express')
const authMiddeleware = require('../src/middelewares/auth.js')
const router = express.Router()
const Bill = require('../models/custumerBill')
router.use(authMiddeleware)

router.get('/bills', async (req, res) => {
    try {
        const custumer = req.query.userId
        const page = req.query.page
        const limit = parseInt(req.query.limit)
        const skip = limit * (page - 1)
        await Bill.find({ custumer }).skip(skip).limit(limit).exec((err, bill) => {
            res.send({ bill })
            if (err) throw err
        })
    } catch (err) { return res.status(400).send({ error: 'Error loding bills' }) }
})

router.post('/bills', async (req, res) => {
    try {
        if (req.body.paymentAmount) {
            await Bill.create({
                custumer: req.body.custumer,
                product: req.body.product,
                paymentAmount: req.body.paymentAmount
            })
            return res.send('Ok')
        } else if (req.body.product && req.body.amount) {
            const bill = await Bill.create({
                custumer: req.body.custumer,
                product: req.body.product,
                amount: req.body.amount
            })
            return res.send({ bill })
        } else return res.send({ error: 'invalid request parameters' })
    } catch (err) { return res.status(400).send({ error: 'failed to register the product' }) }
})

module.exports = app => app.use('/api', router)
