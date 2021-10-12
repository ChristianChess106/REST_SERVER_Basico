const { Router } = require("express");
const { check } = require("express-validator");
const { crearCategoria, obtenerCategoria, obtenerCategorias, actualizarCategoria, borrarCategoria } = require("../controllers/categorias");
const { existeCategoria } = require("../helpers/validarId-categoria");
const { validarJWT, esAdminRole } = require("../middlewares");

const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();

//Obtener todas las categorias - Publico
router.get('/', obtenerCategorias);

//Obtener una categoria por Id - Publico
router.get('/:id', [
    check('id','No es un id valido').isMongoId(),
    validarCampos,
    check('id').custom(existeCategoria),
    validarCampos,
],obtenerCategoria);

//Crear Categoria - Privado - Cualquier persona con token valido
router.post('/',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos,
] ,crearCategoria);

//Actualizar Categoria - Privado - Cualquier persona con token valido
router.put('/:id',[ 
    validarJWT,
    check('id','No es un id valido').isMongoId(),
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeCategoria),
    validarCampos
],actualizarCategoria);

//Borrar Categoria - Admin 
router.delete('/:id',[
    validarJWT,
    check('id','No es un id valido').isMongoId(),
    check('id').custom(existeCategoria),
    esAdminRole,
    validarCampos
],borrarCategoria);


module.exports = router;