const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.POSGRESQL_URI,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect();

const postProfesional = async (req, res) => {
    const { id, tipo_id, nombre, apellido, fecha, hora, 
        direccion, id_barrio, register_by, id_universidad, id_eps , userName, password } = req.body;

    let user = await pool.query(`select user_name from login where user_name = '${userName}'`);
    if(user.rows.length == 0){
      //console.log(req.body)
    let id_tipo = await pool.query(`select id_tipo from tipo_id where tipo = '${tipo_id}'`);
    await pool.query( 
        `INSERT INTO persona_asignada(id,tipo_id) VALUES('${id}','${id_tipo.rows[0].id_tipo}')`
        );
    const { rows } = await pool.query(`select id_persona from persona_asignada where id = '${id}' and tipo_id = '${id_tipo.rows[0].id_tipo}'`);
    await pool.query(
        `insert into persona values ('${rows[0].id_persona}','${nombre}','${apellido}','${fecha}','${hora}','${register_by}');
        insert into persona_direccion values ('${rows[0].id_persona}','${direccion}','${id_barrio}');
        insert into profesional values ('${rows[0].id_persona}','${id_universidad}','${id_eps}');
        insert into login values ('${rows[0].id_persona}','${userName}','${password}','Medium')`
        );
  res.json({ 'RES': 'INSERTADO' });
    } else {
      res.json({ 'RES': 'ESTE UserName ya existe' });
    }
}

module.exports = {
    postProfesional
}       

/* FORMATO DE ENTRADA
{
	"id": 333333333,
	"tipo_id": "C.C", 
	"nombre": "Primera", 
	"apellido":"Prueba", 
	"fecha":"15/05/20", 
	"hora":"22:22:22", 
  "direccion":"Calle nunca 777", 
	"id_barrio":200, 
	"register_by":"Admin-01", 
	"id_universidad":300, 
	"id_eps":400,
	"userName":"PP-01",
	"password":"contra_01"
}
*/