const { response, request } = require("express");
const {Categoria} = require("../models");


//obtenerCategorias - paginado - total - populate
const obtenerCategorias = async(req = request,res = response) => {

    const {limite = 5, desde = 0} = req.query;
    const query = {estado:true};

    const [total,categorias] = await Promise.all([

        Categoria.countDocuments(query),
        Categoria.find(query)
        .populate('usuario','nombre')
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

   return res.status(200).json({
        total,
        categorias
    });
};

//obtenerCategoria - poulate - regresar objeto de la categoria
const obtenerCategoria = async(req = request,res = response) => {

    const {id} = req.params;
    const categoria = await Categoria.findById(id).populate('usuario','nombre');

    if(!categoria.estado){
        res.json({msg:'La categoria no existe'});
    }

   return res.status(200).json({
        categoria
    });

};

const crearCategoria = async(req = request,res = response) => {
    
    const nombre = req.body.nombre.toUpperCase();
    
    const categoriaDb = await Categoria.findOne({nombre});
    
    if(categoriaDb){
        return res.status(400).json({
            msg: `La categoria ${categoriaDb.nombre}, ya Existe`
        });
    }
    
    //generar data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    };
    
    const categoria = new Categoria(data);
    
    //guardar en Db
    await categoria.save();
    
    res.status(201).json(categoria);
    
};

//actualizar categoria - recibe el nombre
const actualizarCategoria = async(req = request,res = response) => {

    const {id} = req.params;
    const {estado, usuario, ...data} = req.body;
    
    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data);


   return res.status(200).json({
        categoria
    });
};

//borrar categoria - es cambiar el estado a false
const borrarCategoria = async(req = request,res = response) => {

    const {id} = req.params;
    const categoria = await Categoria.findByIdAndUpdate(id,{estado: false});

   return res.json(categoria);
};

module.exports = {
    crearCategoria,
    obtenerCategorias,
    actualizarCategoria,
    obtenerCategoria,
    borrarCategoria
};