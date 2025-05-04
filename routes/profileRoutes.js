const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');

router.get('/profile', verifyToken, (req, res) => {
  res.json({
    message: 'Autentifikuotas vartotojas',
    user: req.user
  });
});

module.exports = router;
