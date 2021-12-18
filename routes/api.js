const router = require('express').Router()
const userController = require('../controllers/UserController')

router.get('/users', userController.users)

module.exports = router

