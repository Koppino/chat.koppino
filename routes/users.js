const { ensureAuthenticated } = require('../config/auth')
const userController = require('../controllers/UserController')
const router = require('express').Router()

router.get('/', ensureAuthenticated, userController.getUsers)
router.get('/:_id', ensureAuthenticated, userController.getUser)

module.exports = router