const Role = require('../models/role');
const Usuario = require('../models/usuario');

const esRolValido = async(rol = '') => {
    const existeRol = await Role.findOne({rol});
    if(!existeRol){
        throw new Error(`El rol ${rol} no esta registrado en la BD`)
    }
};

const emailExiste = async (correo) =>{

   
    const existeEmail = await Usuario.findOne({correo});
    if (existeEmail) {
        throw new Error(`El correo ${correo} ya existe`)
    };
};

const existeUsuarioId = async (id) =>{

   const existeUsuario = await Usuario.findById(id);
   if (!existeUsuario) {
    throw new Error(`El Usuario con el id: ${id} no existe`)
};
};


module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioId
}