const { Pool } = require('pg');

const pool = new Pool({
    connectionString: "postgres://xilhjodzcndyvc:b9813a391f2b2c4549ab87cfb14467b85798d649fe56fe7baaec6120aea97c84@ec2-23-23-36-227.compute-1.amazonaws.com:5432/dchdj210qgi9r0",//process.env.POSGRESQL_URI,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect();

const postRegistro = async (req, res) => {
    const { id, tipo_id, fecha, hora, temperatura, peso, presion, observaciones } = req.body[0];
    //console.log(req.body)
    let id_tipo = await pool.query(`select id_tipo from tipo_id where tipo = '${tipo_id}'`);
    const { rows } = await pool.query(`select id_persona from persona_asignada where id = '${id}' and tipo_id = '${id_tipo.rows[0].id_tipo}'`);
    // Falta comparar XD
    console.log(rows);
    if(rows.length != 0){
      let paciente = await pool.query(`select id_paciente from paciente where id_paciente = '${rows[0].id_persona}'`);
      console.log(paciente.rows);
      if(paciente.rows.length != 0){
          await pool.query(
              `insert into visita(id_paciente,fecha,hora) values ('${rows[0].id_persona}','${fecha}','${hora}')`);
          let visit = await pool.query(
              `select id_visita from visita where id_paciente = '${rows[0].id_persona}' and fecha = '${fecha}' and hora = '${hora}'`);
          await pool.query(`insert into registro_visita values ('${visit.rows[0].id_visita}','${temperatura}','${peso}','${presion}','${observaciones}')`);
          // Receta
          req.body[1].map(async (e) => { await pool.query(
              `insert into receta_visita values ('${visit.rows[0].id_visita}','${e.id_medicamento}','${e.dosis}')`);
          });
        res.json({ 'RES': 'INSERTADO' });
      } else res.json({ 'RES': 'NO SE ENCONTRO EN PACIENTE' });
    } else res.json({ 'RES': 'LA PERSONA NO EXISTE' });
    
}

module.exports = {
    postRegistro
}       

/* FORMATO DE ENTRADA
[
	{
		"id": 333333333,
		"tipo_id": "C.C", 
		"fecha":"15/05/20", 
		"hora":"33:33:33", 
		"temperatura":"40°C", 
		"peso":"76 Kg", 
		"presion":"105/85 mmHg", 
		"observaciones":"Expresa cansancio y sueño constante"
	},
	[
		{
			"id_medicamento":600,
			"dosis":"Cada 8h"
		},
		{
			"id_medicamento":601,
			"dosis":"1 Diaria"
		}
	]
]
*/