const express = require('express')
const authMiddeleware = require('../src/middelewares/auth.js')
const router = express.Router()
const Bill = require('../models/customerBill')
router.use(authMiddeleware)

router.get('/bills', async (req, res) => {
    try {
        const customer = req.query.userId
        const page = req.query.page
        const limit = parseInt(req.query.limit)
        const skip = limit * (page - 1)
        await Bill.find({ customer, billPaymentDate: null }).skip(skip).limit(limit).populate('product').exec(async (err, bill) => {
            if (err) throw err
            return res.status(200).send(bill)
        })
    } catch (err) { return res.status(400).send({ error: 'Erro ao carregar a fatura.' }) }
})

router.post('/bills', async (req, res) => {
    try {
        if (req.body.paymentAmount) {
            await Bill.create({
                customer: req.body.customer,
                paymentAmount: req.body.paymentAmount
            })
            return res.status(201).send({ success: 'Pagamento realizado.' })
        } else if (req.body.product && req.body.amount) {
            await Bill.create({
                customer: req.body.customer,
                product: req.body.product,
                amount: req.body.amount
            })
            return res.status(201).send({ success: 'Produto adicionado.' })
        } else return res.send({ error: 'Invalid request parameters.' })
    } catch (err) { return res.status(400).send({ error: 'Falha ao registrar o produto.' }) }
})

router.put('/bills', async (req, res) => {
    const { id, customer, product, amount } = req.body
    try {
        if (req.body.paymentAmount) {
            await Bill.findOneAndUpdate({ _id: id }, { customer, paymentAmount: req.body.paymentAmount })
            return res.status(200).send({ success: 'Pagamento atualizado.' })
        }
        await Bill.findOneAndUpdate({ _id: id }, { customer, product, amount })
        return res.status(200).send({ success: 'Venda atualizada.' })
    } catch (err) {
        return res.status(404).send({ error: 'Fatura não encontrada.' })
    }
})

router.patch('/bills', async (req, res) => {
    try {
        await Bill.updateMany({ customer: req.body.customer, billPaymentDate: null }, { billPaymentDate: Date.now() })
        return res.status(200).send({ success: 'Fatura limpa.' })
    } catch (err) {
        return res.status(400).send({ error: 'Erro ao carregar as vendas' })
    }
})

router.delete('/bills', async (req, res) => {
    try {
        await Bill.findOneAndRemove({ _id: req.body.id })
        return res.status(200).send({ success: 'Venda deletada.' })
    } catch (err) {
        return res.status(404).send({ error: 'Venda não encontrada.' })
    }
})

module.exports = app => app.use('/api', router)
