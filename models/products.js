const db = require('../database/index')
const ProductSchema = new db.Schema({
    descrition: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    code: {
        type: String
    },
    amount: {
        type: Number,
        required: true
    }
})

const Products = db.model('Products', ProductSchema)
module.exports = Products
