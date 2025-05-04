const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const checkCodeRoute = require('./routes/checkCode'); // 🆕 PRIDĖTA
const captchaRoute = require('./routes/verify-captcha'); // ✅ PRIDĖTA

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// API maršrutai
app.use('/api', authRoutes);
app.use('/api', profileRoutes);
app.use('/api', checkCodeRoute);
app.use('/api', captchaRoute); // ✅ PRIDĖTA

// Testinis maršrutas
app.get('/', (req, res) => {
  res.send('Serveris veikia 🎉');
});

// Paleidžiam serverį
app.listen(PORT, () => {
  console.log(`✅ Serveris paleistas: http://localhost:${PORT}`);
});
