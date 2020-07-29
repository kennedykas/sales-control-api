const db = require('../database/index')
const ProductSchema = new db.Schema({
    descrition: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: String,
        required: true
    },
    code: {
        type: String
    }
})

const Products = db.model('Products', ProductSchema)
module.exports = Products
