const { request, response } = require("express");
const { Categoria, Producto } = require("../models");


//obtenerProductos - paginado - total - populate
const obtenerProductos = async(req = request,res = response) => {

    const {limite = 5, desde = 0} = req.query;
    const query = {estado:true};

    const [total,productos] = await Promise.all([

        Producto.countDocuments(query),
        Producto.find(query)
        .populate('categoria','nombre')
        .populate('usuario','nombre')
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

   return res.status(200).json({
        total,
        productos
    });
};

//obtenerProducto - populate - regresar objeto del producto
const obtenerProducto = async(req = request,res = response) => {

    const {id} = req.params;
    const producto = await Producto.findById(id).populate('usuario','nombre').populate('categoria','nombre');

    if(!producto.estado){
        res.json({msg:'El producto no existe'});
    }

   return res.status(200).json({
        producto
    });

};

const crearProducto = async(req = request,res = response) => {
    
    let {categoria,estado,usuario,...data} = req.body;
    categoria = categoria.toUpperCase();

    const buscarCategoria = await Categoria.findOne({nombre:categoria});

    const productoDb = await Producto.findOne({nombre:data.nombre});
    if(productoDb){
        return res.status(400).json({
            msg:`El producto ${productoDb.nombre} ya existe`
        });
    }

    if(data.nombre){
        data.nombre = data.nombre.toUpperCase();
    }

    data.categoria = buscarCategoria._id;
    data.usuario = req.usuario._id;

    const producto = await new Producto(data);

    await producto.save();

    res.status(201).json({
       producto
    })
    
};

//actualizar categoria - recibe el nombre
const actualizarProducto = async(req = request,res = response) => {

    const {id} = req.params;
    let {categoria, ...data} = req.body;

    categoria = categoria.toUpperCase();
    if(data.nombre){
        data.nombre = data.nombre.toUpperCase();
    }
    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id,data, {new:true});

    return res.json({
        producto
    });
   
};

//borrar categoria - es cambiar el estado a false
const borrarProducto = async(req = request,res = response) => {

    const {id} = req.params;
    const producto = await Producto.findByIdAndUpdate(id,{estado: false});

   return res.json(producto);
};

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
};