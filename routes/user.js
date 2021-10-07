const { Router } = require("express");
const { check } = require("express-validator");

const {validarCampos,validarJWT,esAdminRole,tieneRol} = require('../middlewares/index');

const { usuariosGet, usuariosPut, usuariosPost, usuariosDelete, usuariosPatch } = require("../controllers/user");
const { esRolValido, emailExiste, existeUsuarioId } = require("../helpers/db-validators");

// const { validarCampos } = require("../middlewares/validar-campos");
// const { validarJWT } = require("../middlewares/validar-jwt");
// const { esAdminRole, tieneRol } = require("../middlewares/validar-roles");


const router = Router();

router.get('/', usuariosGet);

router.put('/:id',[
    check('id','No es un id valido').isMongoId(),
    check('id').custom(existeUsuarioId),
    check('rol').custom(esRolValido),
    validarCampos
],usuariosPut);

router.post('/',[
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('password','El Password debe ser más de 6 letras').isLength({min:6}),
    check('correo').custom(emailExiste),
    // check('rol','No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('rol').custom(esRolValido),
    validarCampos
],usuariosPost);

router.delete('/:id',[
    validarJWT,
    // esAdminRole,
    tieneRol('ADMIN_ROLE','VENTAS_ROLE'),
    check('id','No es un id valido').isMongoId(),
    check('id').custom(existeUsuarioId),
    validarCampos
],usuariosDelete);

router.patch('/', usuariosPatch);


module.exports = router;
