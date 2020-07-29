const express = require('express')
const router = express.Router()
const Bill = require('../models/customerBill')
const User = require('../models/user')

router.get('/billCustomer', async (req, res) => {
    try {
        if (req.query.page) {
            const customer = req.query.userId
            const page = req.query.page
            const limit = parseInt(req.query.limit)
            const skip = limit * (page - 1)
            await Bill.find({ customer, billPaymentDate: null }).skip(skip).limit(limit).populate('product').exec((err, bill) => {
                if (err) throw err
                return res.status(200).send(bill)
            })
        } else {
            const user = await User.findOne({ _id: req.query.userId })
            return res.status(200).send(user)
        }
    } catch (err) { return res.status(400).send({ error: 'Error loding bills.' }) }
})

module.exports = app => app.use('/api', router)
