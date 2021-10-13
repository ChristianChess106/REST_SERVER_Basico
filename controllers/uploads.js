const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { request, response } = require("express");
const { subirArchivo } = require("../helpers");
const {Usuario,Producto} = require('../models');


const cargarArchivo = async(req = request, res = response) => {
   
    try {
        //imagenes
        // const nombre = await subirArchivo(req.files,['txt','md']);
         const nombre = await subirArchivo(req.files,undefined,'imgs');
        
        res.json({
            nombre
        });

    } catch (error) {
        res.status(400).json({error});
    }
};

const actualizarImagen = async(req = request,res = response) => {

    
    const {coleccion,id} = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg:`no existe usuario con id ${id}`
                });
            }
            break;
            
        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg:`no existe un producto con id ${id}`
                });
            };
            break;
    
        default:
            return res.status(500).json({msg:'se me olvidó validar esto'});
    }

    //Limpiar imagenes previas
    if(modelo.img){
        const pathImagen = path.join(__dirname,'../uploads',coleccion,modelo.img);
        if(fs.existsSync(pathImagen)){
            fs.unlinkSync(pathImagen);
        }
    }

    const nombre = await subirArchivo(req.files,undefined, coleccion);
    modelo.img = nombre;

    await modelo.save();

    res.json(modelo);
};

const actualizarImagenCloudinary = async(req = request,res = response) => {

    
    const {coleccion,id} = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg:`no existe usuario con id ${id}`
                });
            }
            break;
            
        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg:`no existe un producto con id ${id}`
                });
            };
            break;
    
        default:
            return res.status(500).json({msg:'se me olvidó validar esto'});
    }

    //Limpiar imagenes previas
    if(modelo.img){
       const nombreArr = modelo.img.split('/');
       const nombre = nombreArr[nombreArr.length - 1];
       const [public_id] = nombre.split('.');
       cloudinary.uploader.destroy(public_id);
    }
    const {tempFilePath} = req.files.archivo;
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath);

   
    modelo.img = secure_url;

    await modelo.save();

    res.json(modelo);
};

const mostrarImagen = async(req = request,res = response) => {

    const {coleccion,id} = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg:`no existe usuario con id ${id}`
                });
            }
            break;
            
        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg:`no existe un producto con id ${id}`
                });
            };
            break;
    
        default:
            return res.status(500).json({msg:'se me olvidó validar esto'});
    }

    //Limpiar imagenes previas
    if(modelo.img){
        const pathImagen = path.join(__dirname,'../uploads',coleccion,modelo.img);
        if(fs.existsSync(pathImagen)){
            return res.sendFile(pathImagen);
        }
    }
    const noImagen = path.join(__dirname,'../assets/no-image.jpg');
    return res.sendFile(noImagen);
};

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}