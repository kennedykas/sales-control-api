require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
require('../controllers/authController')(app)
require('../controllers/productsController')(app)
require('../controllers/customerBillController')(app)
require('../controllers/viewCustomerController')(app)
require('../controllers/userController')(app)
app.listen(process.env.PORT || 3000)
