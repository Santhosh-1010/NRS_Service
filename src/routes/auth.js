const express = require('express');
const { login, handleLoginMethodNotAllowed } = require('../controllers/authController');

const router = express.Router();

router.post('/login', login);

router.all('/login', handleLoginMethodNotAllowed);

module.exports = router;
