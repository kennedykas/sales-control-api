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
            return res.status(200).send(products)
        })
    } catch (err) {
        return res.status(400).send({ error: 'Erro ao carregar os produtos.' })
    }
})

router.post('/products', async (req, res) => {
    const { code, descrition } = req.body
    try {
        if (code) {
            if (await Products.findOne({ code })) {
                return res.status(400).send({ error: 'Código do produto ja existe.' })
            }
        }
        if (await Products.findOne({ descrition })) {
            return res.status(400).send({ error: 'Nome do produto ja existe.' })
        }
        await Products.create(req.body)
        return res.status(201).send({ success: 'Produto adicionado' })
    } catch (err) {
        return res.status(400).send({ error: 'Falha ao registrar o produto.' })
    }
})

router.delete('/products', async (req, res) => {
    const idProduct = req.body._id
    const product = Products.findOne({ _id: idProduct })
    try {
        if (!await Bill.findOne({ product: idProduct, billPaymentDate: null })) {
            if (product) {
                await product.remove()
                return res.status(200).send({ success: 'Produto deletado.' })
            } else return res.status(404).send({ error: 'Produto não encontrado.' })
        } else {
            return res.status(409).send({ error: 'O produto está registrado em uma fatura em aberto.' })
        }
    } catch (err) {
        return res.status(500).send({ error: err })
    }
})

router.put('/products', async (req, res) => {
    const { _id, descrition, price, code } = req.body
    try {
        const product = await Products.findOne({ _id })
        if (product) {
            if (code === '' || await Products.findOne({ code: code, _id: _id }) || !await Products.findOne({ code: code })) {
                await product.update({ descrition, price, code })
                return res.status(200).send({ success: 'Produto alterado.' })
            }
            return res.status(404).send({ error: 'Código do produto ja existe.' })
        } else {
            throw new Error()
        }
    } catch (err) {
        return res.status(404).send({ error: err })
    }
})

module.exports = app => app.use('/api', router)
