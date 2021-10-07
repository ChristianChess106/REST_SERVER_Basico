const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');


const validarJWT = async(req = request,res = response,next) =>{

    const token = req.header('x-token');

    if(!token){
        return res.status(401).json({
            msg:'no hay token en la peticion'
        });
    }

    try {

       const {uid} = jwt.verify(token,process.env.SECRETORPRIVATEKEY);
       
       //leer modelo, usuario que corresponde al id
       const uAutenticado = await Usuario.findById(uid);
       if(!uAutenticado){
           return res.status(401).json({
            msg:'token no válido - Usuario no existe en BD'
           });
       }

       //preguntar si el usuario esta activo estado=true
       if(!uAutenticado.estado){
           return res.status(401).json({
               msg:'token no válido - Usuario con estado false'
           });
       }

       req.usuario = uAutenticado; 
       req.uid = uid;
        
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg:'token no valido'
        })
    }
};

module.exports = {
    validarJWT
}
