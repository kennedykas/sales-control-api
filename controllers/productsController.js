const express = require('express')
const authMiddeleware = require('../src/middelewares/auth.js')
const router = express.Router()
const Products = require('../models/products')
router.use(authMiddeleware)

router.get('/products', async (req, res) => {
    try {
        const page = req.query.page
        const limit = parseInt(req.query.limit)
        const skip = limit * (page - 1)

        await Products.find().skip(skip).limit(limit).exec((err, products) => {
            res.send({ products })
            if (err) throw err
        })
    } catch (err) {
        return res.status(400).send({ error: 'Error loding products' })
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
        const products = await Products.create(req.body)
        return res.send({ products })
    } catch (err) {
        return res.status(400).send({ error: 'failed to register the product' })
    }
})

module.exports = app => app.use('/api', router)
