const { response, request } = require("express");
const {ObjectId} = require('mongoose').Types;
const {Usuario,Categoria,Producto} = require('../models/index');

const coleccionesPermitidas = ['usuarios','categorias','productos','roles'];

const buscarUsuarios = async(termino = '',res = response) =>{

    const esMongoID = ObjectId.isValid(termino);

    if(esMongoID){
        const usuario = await Usuario.findById(termino);
       return res.json({
           results:(usuario) ? [usuario] : []
       });
    };

    const regExpression = new RegExp(termino, 'i');
    const usuarios = await Usuario.find({
        $or:[{nombre: regExpression}, {correo:regExpression}],
        $and:[{estado:true}]
    });

    res.json({
        results: usuarios  
    });

};

const buscarCategorias = async(termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino);
    if(esMongoID){
        const categoria = await Categoria.findById(termino);
       return res.json({
           results:(categoria) ? [categoria] : []
       });
    };    

    const regExpression = new RegExp(termino, 'i');
    const categorias = await Categoria.find({
        $and:[{nombre:regExpression},{estado:true}]
    });

    res.json({
        results:categorias
    });
};

const buscarProductos = async(termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino);
    if(esMongoID){
        const producto = await Producto.findById(termino).populate('categoria','nombre');
       return res.json({
           results:(producto) ? [producto] : []
       });
    };    

    const regExpression = new RegExp(termino, 'i');
    const productos = await Producto.find({
        $or:[{nombre:regExpression},{descripcion:regExpression}],
        $and:[{estado:true}]
    }).populate('categoria','nombre');

    res.json({
        results:productos
    });
};


const buscar = (req = request,res = response) => {

    const{coleccion,termino} = req.params;

    if(!coleccionesPermitidas.includes(coleccion)){
        return res.status(400).json({
            msg:`las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino,res);
        break;
        case 'categorias':
            buscarCategorias(termino,res);
        break;
        case 'productos':
            buscarProductos(termino,res);
        break;
        case 'roles':

        break;

        default:
          res.status(500).json({
                msg:'se le olvido hacer esta busqueda'
            })  
    }

};

module.exports = {
    buscar
};
