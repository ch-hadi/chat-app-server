const express = require('express')

const routes = express.Router()

const {login, allUser,signUp} = require('../controllers/userController')
const { protect } = require('../middleWare/authMiddleWare')

routes.post('/login', login)
routes.post('/signup' , signUp)
routes.post('/all-users',protect, allUser)




module.exports = routes