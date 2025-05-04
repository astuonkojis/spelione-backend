const express = require('express');
const router = express.Router();
const authController = require('../authController');

// Registracijos maršrutas
router.post('/register', authController.register);

// Prisijungimo maršrutas
router.post('/login', authController.login);

// Pamiršau slaptažodį
router.post('/forgot-password', authController.forgotPassword);

// Pakeisti slaptažodį
router.post('/change-password', authController.changePassword);

module.exports = router;
