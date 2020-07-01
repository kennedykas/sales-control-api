const express = require('express')
const authMiddeleware = require('../src/middelewares/auth.js')
const router = express.Router()
const Products = require('../models/products')
const Bill = require('../models/customerBill')
router.use(authMiddeleware)

router.get('/products', async (req, res) => {
    try {
        const page = req.query.page
        const limit = parseInt(req.query.limit)
        const skip = limit * (page - 1)
        await Products.find().skip(skip).limit(limit).exec((err, products) => {
            if (err) throw err
            return res.status(200).send({ products })
        })
    } catch (err) {
        return res.status(400).send({ error: 'Error loding products.' })
    }
})

router.post('/products', async (req, res) => {
    const { code, descrition } = req.body
    try {
        if (await Products.findOne({ code })) {
            return res.status(400).send({ error: 'Product code already exists.' })
        }
        if (await Products.findOne({ descrition })) {
            return res.status(400).send({ error: 'Product name already exists.' })
        }
        await Products.create(req.body)
        return res.status(201).send('Product added')
    } catch (err) {
        return res.status(400).send({ error: 'Failed to register the product.' })
    }
})

router.delete('/products', async (req, res) => {
    const { product } = req.body
    try {
        if (!await Bill.findOne({ product })) {
            await Products.findOneAndRemove({ _id: product })
            return res.status(200).send('Produtct deletet.')
        } else {
            return res.status(409).send({ error: 'The product is registered in an open invoice.' })
        }
    } catch (err) {
        console.log(err)
        return res.status(404).send({ error: 'Product not found.' })
    }
})

router.put('/products', async (req, res) => {
    const { id, descrition, price, code } = req.body
    try {
        await Products.findOneAndUpdate({ _id: id }, { descrition, price, code })
        return res.status(200).send('Changed product.')
    } catch (err) {
        return res.status(404).send({ error: err })
    }
})

module.exports = app => app.use('/api', router)
