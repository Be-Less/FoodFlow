const express = require('express');
const { registerController, loginController } = require('../controllers/authController');
const router = express.Router();

//register ll Post
router.post('/register', registerController);

//login ll Post
router.post('/login', loginController);

module.exports = router;