const express = require("express");
const User = require("../models/User");
const router = express.Router();
const mongoose = require("mongoose");
const authController = require('../controllers/AuthController.js')
const mainController = require('../controllers/MainController')
const {ensureAuthenticated, forwardAuthenticated} = require('../config/auth')

router.get('/',ensureAuthenticated, mainController.getHomepage);

router.get('/login', forwardAuthenticated,authController.getLogin)
router.post('/login', forwardAuthenticated,authController.doLogin)

router.get('/logout', ensureAuthenticated, authController.doLogout)
router.post('/register',forwardAuthenticated, authController.doRegister)
router.get('/register', forwardAuthenticated,authController.getRegister)

router.get('/dashboard', ensureAuthenticated , mainController.getDashboard)

module.exports = router;
