const { Pool } = require('pg');

const pool = new Pool({
    connectionString: "postgres://xilhjodzcndyvc:b9813a391f2b2c4549ab87cfb14467b85798d649fe56fe7baaec6120aea97c84@ec2-23-23-36-227.compute-1.amazonaws.com:5432/dchdj210qgi9r0",//process.env.POSGRESQL_URI,
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