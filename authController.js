const pool = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendNewPassword = require('./middleware/sendEmail');
require('dotenv').config();

module.exports = {
  register: async function (req, res) {
    const { name, surname, email, password, group_name } = req.body;

    if (!name || !surname || !email || !password || !group_name) {
      return res.status(400).json({ error: 'Prašome užpildyti visus laukus' });
    }

    try {
      const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
      if (existing.rows.length > 0) {
        return res.status(400).json({ error: 'Šis el. paštas jau naudojamas' });
      }

      const groupRes = await pool.query('SELECT id FROM groups WHERE name = $1', [group_name]);
      if (groupRes.rows.length === 0) {
        return res.status(400).json({ error: 'Grupė nerasta' });
      }

      const groupId = groupRes.rows[0].id;
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      await pool.query(`
        INSERT INTO users (first_name, last_name, email, password_hash, group_id)
        VALUES ($1, $2, $3, $4, $5)
      `, [name, surname, email, passwordHash, groupId]);

      res.json({ success: true, message: 'Registracija sėkminga' });

    } catch (err) {
      console.error('Registracijos klaida:', err);
      res.status(500).json({ error: 'Serverio klaida' });
    }
  },

  login: async function (req, res) {
    const { email, password } = req.body;

    try {
      const userRes = await pool.query(`
        SELECT users.*, groups.name AS group_name
        FROM users
        JOIN groups ON users.group_id = groups.id
        WHERE users.email = $1
      `, [email]);

      if (userRes.rows.length === 0) {
        return res.status(404).json({ error: 'Vartotojas nerastas' });
      }

      const user = userRes.rows[0];
      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) {
        return res.status(401).json({ error: 'Neteisingas slaptažodis' });
      }

      const token = jwt.sign(
        {
          userId: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          group_name: user.group_name
        },
        process.env.JWT_SECRET,
        { expiresIn: '2h' }
      );

      res.json({
        success: true,
        token: token,
        first_name: user.first_name,
        last_name: user.last_name,
        group_name: user.group_name
      });

    } catch (err) {
      console.error('Prisijungimo klaida:', err);
      res.status(500).json({ error: 'Serverio klaida' });
    }
  },

  forgotPassword: async function (req, res) {
    const { email } = req.body;

    try {
      const userRes = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
      if (userRes.rows.length === 0) {
        return res.status(404).json({ error: 'El. paštas nerastas' });
      }

      const newPassword = Math.random().toString(36).slice(-8);
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(newPassword, salt);

      await pool.query('UPDATE users SET password_hash = $1 WHERE email = $2', [hash, email]);

      const sent = await sendNewPassword(email, newPassword);
      if (!sent) return res.status(500).json({ error: 'Nepavyko išsiųsti laiško' });

      res.json({ success: true, message: 'Naujas slaptažodis išsiųstas el. paštu' });

    } catch (err) {
      console.error('Pamiršau slaptažodį klaida:', err);
      res.status(500).json({ error: 'Serverio klaida' });
    }
  },

  changePassword: async function (req, res) {
    const { email, oldPassword, newPassword } = req.body;

    if (!email || !oldPassword || !newPassword) {
      return res.status(400).json({ error: 'Prašome užpildyti visus laukus' });
    }

    try {
      const userRes = await pool.query('SELECT password_hash FROM users WHERE email = $1', [email]);
      if (userRes.rows.length === 0) {
        return res.status(404).json({ error: 'Vartotojas nerastas' });
      }

      const user = userRes.rows[0];
      const valid = await bcrypt.compare(oldPassword, user.password_hash);
      if (!valid) {
        return res.status(401).json({ error: 'Neteisingas senas slaptažodis' });
      }

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(newPassword, salt);

      await pool.query('UPDATE users SET password_hash = $1 WHERE email = $2', [hash, email]);

      res.json({ success: true, message: 'Slaptažodis sėkmingai pakeistas' });

    } catch (err) {
      console.error('Slaptažodžio keitimo klaida:', err);
      res.status(500).json({ error: 'Serverio klaida' });
    }
  }
};
