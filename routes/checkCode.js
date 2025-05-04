// routes/checkCode.js

const express = require('express');
const router = express.Router();

// Grupės kodai ir pavadinimai
const groupCodes = {
  'AAA': 'Draugai Vilnius',
  'BBB': 'Kaimynai',
  'CCC': 'Kolegų grupė',
};

router.post('/check-code', (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Kodas yra privalomas' });
  }

  const normalized = code.trim().toUpperCase();

  if (groupCodes[normalized]) {
    return res.json({ group_name: groupCodes[normalized] });
  } else {
    return res.status(400).json({ error: 'Neteisingas kodas' });
  }
});

module.exports = router;
