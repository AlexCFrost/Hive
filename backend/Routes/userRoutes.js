const express = require('express')
const router = express.Router()

const {loginUser, signupUser, google, googleCallBack} = require('../Controller/userController')

// Login
router.post('/login', loginUser)

// Signup
router.post('/signup', signupUser)

//Google
router.get('/auth/google',google)

router.get('/auth/google/callback', googleCallBack)

module.exports = router
