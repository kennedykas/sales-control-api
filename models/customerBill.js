const db = require('../database/index')
const BillSchema = new db.Schema({
    customer: {
        type: db.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: db.Schema.Types.ObjectId,
        ref: 'Products'
    },
    amount: {
        type: Number
    },
    paymentAmount: {
        type: String
    },
    billPaymentDate: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Bill = db.model('Bill', BillSchema)
module.exports = Bill
