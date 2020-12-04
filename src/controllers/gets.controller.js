const { Pool } = require('pg');

const pool = new Pool({
    connectionString: "postgres://xilhjodzcndyvc:b9813a391f2b2c4549ab87cfb14467b85798d649fe56fe7baaec6120aea97c84@ec2-23-23-36-227.compute-1.amazonaws.com:5432/dchdj210qgi9r0",//process.env.POSGRESQL_URI,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect();

const getBarrio = async (req, res) => { 
    const { rows } = await pool.query(`SELECT id_barrio as id, barrio as title FROM barrio_id`);
    res.send(rows);
}


const getCiudad = async (req, res) => { 
    const { rows } = await pool.query(`SELECT id_ciudad as id, ciudad as title FROM paciente_ciudad`);
    res.send(rows);
}


const getEps = async (req, res) => { 
    const { rows } = await pool.query(`SELECT id_eps as id, eps as title FROM profesional_eps`);
    res.send(rows);
}


const getUniversidad = async (req, res) => { 
    const { rows } = await pool.query(`SELECT id_universidad as id, universidad as title FROM profesional_universidad`);
    res.send(rows);
}

const getParentesco = async (req, res) => { 
    const { rows } = await pool.query(`SELECT id_parentesco as id, parentesco as title FROM paciente_parentesco`);
    res.send(rows);
}

const getMedicamento = async (req, res) => { 
    const { rows } = await pool.query(`SELECT id_medicamento as id, medicamento as title FROM medicamento`);
    res.send(rows);
}

const getPacientes = async (req, res) => { 
    const { rows } = await pool.query(`SELECT * FROM paciente`);
    res.send(rows);
}

const getProfesional = async (req, res) => { 
    const { rows } = await pool.query(
        `select id_persona as id, nombre as title from persona
        where id_persona in (SELECT id_profesional FROM profesional)`);
    res.send(rows);
}

const getGeoplace = async (req, res) => {
    const { rows } = await pool.query(`select lat,long from paciente`);
    res.send(rows);
}

const getAvgNeighbor = async (req ,res) => {
    const { rows } = await pool.query(`
    select barrio as neighborhood, average  from (select id_barrio, count(id_barrio) as average from persona_direccion 
    where id_persona in (select id_paciente from paciente)
    group by id_barrio) aux
    natural join barrio_id`);
    res.send(rows);
}

const getAvgEdad = async (req ,res) => {
    const { rows } = await pool.query(`
        select edad as age, count(edad) as numberofpatients from paciente
        group by edad`);
    res.send(rows);
}

const getInventario = async (req, res ) => {
    const { rows } = await pool.query(
        `select medicamento,synlab,tecnoquimicas,procaps,quifarmed from inventario_laboratorios 
            natural join medicamento`);
    res.send(rows);
} 

module.exports = {
    getBarrio,
    getCiudad,
    getEps,
    getUniversidad,
    getPacientes,
    getProfesional,
    getParentesco,
    getMedicamento,
    getGeoplace,
    getAvgNeighbor,
    getAvgEdad,
    getInventario
}


/* FORMATO DE SALIDA

*/