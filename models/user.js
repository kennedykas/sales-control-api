const db = require('../database/index')
const bcrypt = require('bcryptjs')

const USER_DEFAULT = 'CUSTOMER'

const UserSchema = new db.Schema({

    name: {
        type: String,
        require: true,
        unique: true

    },
    cpf: {
        type: String
    },
    phone: {
        type: String
    },
    email: {
        type: String,
        lowercase: true
    },
    password: {
        type: String,
        select: false
    },
    role: {
        type: String,
        default: USER_DEFAULT
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updateAt: {
        type: Date,
        default: Date.now
    }
})

UserSchema.pre('save', async function (next) {
    if (this.role === 'ADMIN') {
        const ENCRYPT_ROUNDS = 10
        const hash = await bcrypt.hash(this.password, ENCRYPT_ROUNDS)
        this.password = hash
    }
    next()
})


const User = db.model('User', UserSchema)
module.exports = User
