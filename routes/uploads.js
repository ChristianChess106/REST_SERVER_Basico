const { Router } = require("express");
const { check } = require("express-validator");
const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require("../controllers/uploads");
const { coleccionesPermitidas } = require("../helpers");
const { validarArchivoSubir } = require("../middlewares");
const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();

router.post('/',validarArchivoSubir,cargarArchivo);

router.put('/:coleccion/:id',[
    validarArchivoSubir, 
    check('id','el id debe ser de mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c,['usuarios','productos'])),
    validarCampos
],actualizarImagenCloudinary);

router.get('/:coleccion/:id',[
    check('id','el id debe ser de mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c,['usuarios','productos'])),
    validarCampos
],mostrarImagen)


module.exports = router;