const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.POSGRESQL_URI,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect();

const putLogin = async (req, res) => {
    const { userName, password } = req.body; 
    const { rows } = await pool.query(
        `SELECT user_name, privilege FROM login
        where user_name = '${userName}' and contraseña = '${password}'`);
    res.send(rows);
}

module.exports = {
    putLogin
}

/* FORMATO DE ENTRADA
{
	"userName":"Admin-01",
	"password":"zaq123"
}
*/

/* FORMATO DE SALIDA
[
  {
    "user_name": "Admin-01",
    "privilege": "High"
  }
]
*/