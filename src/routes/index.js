const Router = require('express-promise-router');
const router = new Router();
//const { getPacientes, putPaciente, postPaciente, deletePaciente } = require('../controllers/index.controller')
const { putLogin } = require('../controllers/loguin.controller')
const { postProfesional } = require('../controllers/profesional.controller')
const { postPaciente, putPaciente } = require('../controllers/paciente.controller')
const { postRegistro } = require('../controllers/registro.controller')
const { getBarrio,getCiudad,getEps,getUniversidad,getPacientes,getProfesional,getParentesco,
    getMedicamento,getGeoplace,getAvgNeighbor,getAvgEdad,getInventario  } = require('../controllers/gets.controller')

/*router.get('/consultar', getPacientes);
router.post('/insertar', postPaciente);
router.put('/actualizar', putPaciente);
router.delete('/eliminar', deletePaciente);*/

router.put('/login', putLogin);
router.post('/insertarProfesional', postProfesional);
router.post('/insertarPaciente', postPaciente);
router.put('/pacienteContact', putPaciente);
router.post('/insertarRegistro', postRegistro);
router.get('/getBarrio', getBarrio);
router.get('/getCiudad', getCiudad);
router.get('/getEps', getEps);
router.get('/getUniversidad', getUniversidad);
router.get('/getPaciente', getPacientes);
router.get('/getProfesional', getProfesional);
router.get('/getParentesco', getParentesco);
router.get('/getMedicamento', getMedicamento);
router.get('/getGeoplace', getGeoplace);
router.get('/getAvgNeighborhood', getAvgNeighbor);
router.get('/getAvgEdad', getAvgEdad);
router.get('/getInventario', getInventario);

module.exports = router;