const pool = require('./db');

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Nepavyko prisijungti:', err);
  } else {
    console.log('✅ Prisijungta prie PostgreSQL! Laikas:', res.rows[0].now);
  }
  pool.end();
});
