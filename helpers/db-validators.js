const { Categoria, Producto } = require('../models');
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

const existeCategoriaPorNombre = async (categoria) =>{

    categoria = categoria.toUpperCase();
    const existeCategoria = await Categoria.findOne({nombre:categoria});
    if (!existeCategoria) {
     throw new Error(`La categoria con el nombre: ${categoria} no existe`)
 };
 };

const existeProducto = async(id) => {

    const producto = await Producto.findById(id);

    if(!producto){
        throw new Error(`El producto con el id: ${id} no existe, intente de nuevo`)
    }

};

//Validar Colecciones Permitidas

const coleccionesPermitidas = (coleccion = '', colecciones = []) =>{

    const incluida = colecciones.includes(coleccion);
    if(!incluida){
        throw new Error(`la coleccion ${coleccion} no es permitida -> ${colecciones}`);
    }
    return true;

};

module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioId,
    existeCategoriaPorNombre,
    existeProducto,
    coleccionesPermitidas
}