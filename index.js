const express = require('express');
const cors = require('cors');
const { Pool } = require('pg'); // ⬅️ Įtraukiam pg
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const checkCodeRoute = require('./routes/checkCode');
const captchaRoute = require('./routes/verify-captcha');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Sukuriam DB prisijungimą su DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Padarom DB objektą pasiekiamą visiems route failams (jei reikia)
app.locals.pool = pool;

// Middleware
app.use(cors());
app.use(express.json());

// API maršrutai
app.use('/api', authRoutes);
app.use('/api', profileRoutes);
app.use('/api', checkCodeRoute);
app.use('/api', captchaRoute);

// Testinis maršrutas
app.get('/', (req, res) => {
  res.send('Serveris veikia 🎉');
});

// Paleidžiam serverį
app.listen(PORT, () => {
  console.log(`✅ Serveris paleistas: http://localhost:${PORT}`);
});
