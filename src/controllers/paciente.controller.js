const { Pool } = require('pg');

const pool = new Pool({
    connectionString: "postgres://xilhjodzcndyvc:b9813a391f2b2c4549ab87cfb14467b85798d649fe56fe7baaec6120aea97c84@ec2-23-23-36-227.compute-1.amazonaws.com:5432/dchdj210qgi9r0",//process.env.POSGRESQL_URI,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect();

const postPaciente = async (req, res) => {
	//Telefono repetido
	const numeros  = req.body[1];
	let duplicados1 = [];
 
	const tempArray = [...numeros].sort();
 
	for (let i = 0; i < tempArray.length; i++) {
		if (tempArray[i + 1] === tempArray[i]) {
			duplicados1.push(tempArray[i]);
		}
	}
	//Email Repetido
	const emails = req.body[2];
	let duplicados2 = [];
 
	const tempArray2 = [...emails].sort();
 
	for (let i = 0; i < tempArray2.length; i++) {
		if (tempArray2[i + 1] === tempArray2[i]) {
			duplicados2.push(tempArray2[i]);
		}
	}

	//Pariente Repetido
	const personas = req.body[3];
	  
	  const busqueda = personas.reduce((acc, persona) => {
	  
		const clave = JSON.stringify(persona);
		acc[clave] = ++acc[clave] || 0;
		return acc;
	  }, {});
	  
	  
	  const duplicados = personas.filter( (persona) => {
		  return busqueda[JSON.stringify(persona)];
	  });
	  
	if(duplicados1.length > 0 || duplicados2.length > 0 || duplicados.length >0){
		res.json({ 'RES': 'BASURA REPETISTE ALGO >:(' });
	} else {
		const { id, tipo_id, nombre, apellido, fecha, hora, 
			direccion, id_barrio, register_by, edad, lat, long, id_profesional, num_habitantes, ciudad_contagio } = req.body[0];
		//console.log(req.body)
		let id_tipo = await pool.query(`select id_tipo from tipo_id where tipo = '${tipo_id}'`);
		await pool.query( 
			`INSERT INTO persona_asignada(id,tipo_id) VALUES('${id}','${id_tipo.rows[0].id_tipo}')`
			);
		const { rows } = await pool.query(`select id_persona from persona_asignada where id = '${id}' and tipo_id = '${id_tipo.rows[0].id_tipo}'`);
		await pool.query(
			`insert into persona values ('${rows[0].id_persona}','${nombre}','${apellido}','${fecha}','${hora}','${register_by}');
			insert into persona_direccion values ('${rows[0].id_persona}','${direccion}','${id_barrio}');
			insert into paciente values ('${rows[0].id_persona}','${edad}','${lat}','${long}','${id_profesional}','${num_habitantes}','${ciudad_contagio}')`
			);
		// Telefono
		req.body[1].map(async (e) => { await pool.query(
			`insert into paciente_telefono values ('${rows[0].id_persona}','${e}')`);
		});
		// Email
		req.body[2].map(async (e) => { await pool.query(
			`insert into paciente_email values ('${rows[0].id_persona}','${e}')`);
		});
		// Parientes
		req.body[3].map(async (e) => { 
			let id_tipo = await pool.query(`select id_tipo from tipo_id where tipo = '${e.tipo_id}'`);
			await pool.query(
			`insert into paciente_pariente values ('${rows[0].id_persona}','${e.id_pariente}','${id_tipo.rows[0].id_tipo}','${e.nombre_completo}','${e.id_parentesco}')`);
		//console.log(e);
		});	
	  res.json({ 'RES': 'INSERTADO' });
	}
    
}

const putPaciente = async (req, res) => {
	const { id,tipo_id } = req.body;
	let id_tipo = await pool.query(`select id_tipo from tipo_id where tipo = '${tipo_id}'`);
	const { rows } = await pool.query(`select id_persona from persona_asignada where id = '${id}' and tipo_id = '${id_tipo.rows[0].id_tipo}'`);
	if(rows.length == 0){
		res.send({ 'RES':'NO EXISTE UN PACIENTE CON ESA IDENTIFICACION' });
	} else {
		let persona = await pool.query(`select nombre_completo as nombre from paciente_pariente where id_paciente = '${rows[0].id_persona}'`);
		let numero = await pool.query(`select telefono as numero from paciente_telefono where id_paciente = '${rows[0].id_persona}'`);
		let email = await pool.query(`select email from paciente_email where id_paciente = '${rows[0].id_persona}'`);
		let contact = [persona.rows, numero.rows, email.rows];
		res.send(contact);
	} 
}

module.exports = {
	postPaciente,
	putPaciente
}       

/* FORMATO DE ENTRADA
[
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
		"edad":23,
		"lat":34535.34545,
		"long":786.23423,
		"id_profesional":3,
		"num_habitantes":2,
		"ciudad_contagio":502
	},
	[
		3145902708,
		3153990050
	],
	[
		"aaaaaa@gmail.com",
		"bbbbbb@hotmail.com"
	],
	[
		{
			"id_pariente":1111111,
			"tipo_id":"T.I",
			"nombre_completo":"Rigoberto Merlin",
			"id_parentesco":700
		},
		{
			"id_pariente":2222222,
			"tipo_id":"C.C",
			"nombre_completo":"Jazmin Morgana",
			"id_parentesco":701
		}
	]
]
*/