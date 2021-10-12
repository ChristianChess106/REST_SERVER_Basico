const { Router } = require("express");
const { check } = require("express-validator");
const {validarJWT, esAdminRole} = require('../middlewares/index')
const { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, borrarProducto } = require('../controllers/productos');
const { validarCampos } = require("../middlewares/validar-campos");
const { existeCategoriaPorNombre, existeProducto } = require("../helpers/db-validators");

const router = Router();

//Obtener todas los productos - Publico
router.get('/',obtenerProductos);

//Obtener producto por Id - Publico
router.get('/:id', [
    check('id','No es un id valido').isMongoId(),
    validarCampos,
    check('id').custom(existeProducto),
    validarCampos,
],obtenerProducto);

//Crear producto - Privado - Cualquier persona con token valido
router.post('/',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('categoria','La categoria es obligatoria').not().isEmpty(),
    check('categoria').custom(existeCategoriaPorNombre),
    validarCampos,
],crearProducto);

//Actualizar Producto - Privado - Cualquier persona con token valido
router.put('/:id',[ 
    validarJWT,
    check('id','No es un id valido').isMongoId(),
    check('id').custom(existeProducto),
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('categoria').custom(existeCategoriaPorNombre),
    validarCampos
],actualizarProducto);

//Borrar Producto - Admin 
router.delete('/:id',[
    validarJWT,
    check('id','No es un id valido').isMongoId(),
    check('id').custom(existeProducto),
    esAdminRole,
    validarCampos
],borrarProducto);


module.exports = router;