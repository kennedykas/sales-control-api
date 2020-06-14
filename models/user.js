const db = require('../database/index')
const bcrypt = require('bcryptjs')

const USER_DEFAULT = 'CUSTOMER'

const UserSchema = new db.Schema({

    name: {
        type: String,
        unique: true,
        required: true
    },
    cpf: {
        type: String,
        unique: true
    },
    phone: {
        type: String
    },
    email: {
        type: String,
        unique: true,
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
    const ENCRYPT_ROUNDS = 10
    const hash = await bcrypt.hash(this.password, ENCRYPT_ROUNDS)
    this.password = hash
    next()
})

const User = db.model('User', UserSchema)
module.exports = User
