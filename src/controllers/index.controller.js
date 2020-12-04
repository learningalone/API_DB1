const { Pool } = require('pg');

const pool = new Pool({
    connectionString: "postgres://xilhjodzcndyvc:b9813a391f2b2c4549ab87cfb14467b85798d649fe56fe7baaec6120aea97c84@ec2-23-23-36-227.compute-1.amazonaws.com:5432/dchdj210qgi9r0",//process.env.POSGRESQL_URI,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect();

const getPacientes = async (req, res) => { 
    const { rows } = await pool.query('SELECT * FROM pacientes');
    res.send(rows);
}

const postPaciente = async (req, res) => {
    const { nombre, apellido, numid } = req.body;
    console.log(req.body)
    await pool.query(
        `INSERT INTO pacientes(nombre, apellido, numid) VALUES('${nombre}','${apellido}','${numid}')`);
  res.json({ 'RES': 'INSERTADO' });
}

const putPaciente = async (req, res) => {
    const {nombre,apellido,numid } = req.body;
    await pool.query(
        `UPDATE pacientes SET nombre ='${nombre}', apellido ='${apellido}' WHERE numid ='${numid}'`);
    res.json({ 'RES': 'ACTUALIZADO' });
}

const deletePaciente = async (req, res) => {
    const { numid } = req.body;

    await pool.query(
        `DELETE FROM pacientes WHERE numid ='${numid}'`
    );
    res.json({ 'RES': 'ELIMINADO' });
}

module.exports = {
    getPacientes,
    postPaciente,
    putPaciente,
    deletePaciente
}