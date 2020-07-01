const express = require('express')
const router = express.Router()
const Bill = require('../models/customerBill')

router.get('/billCustomer', async (req, res) => {
    try {
        const customer = req.query.userIdTest
        const page = req.query.page
        const limit = parseInt(req.query.limit)
        const skip = limit * (page - 1)
        await Bill.find({ customer, billPaymentDate: null }).skip(skip).limit(limit).exec((err, bill) => {
            if (err) throw err
            return res.status(200).send({ bill })
        })
    } catch (err) { return res.status(400).send({ error: 'Error loding bills.' }) }
})

module.exports = app => app.use('/api', router)
