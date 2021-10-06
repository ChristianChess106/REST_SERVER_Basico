const {response, request} = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');

const usuariosGet = async(req = request, res = response) => {

    const {limite = 5, desde = 0} = req.query;
    const query = {estado:true};

/*     const usuarios = await Usuario.find(query)
        .skip(Number(desde))
        .limit(Number(limite));

    const total = await Usuario.countDocuments(query); */

    const [total,usuarios] = await Promise.all([

        Usuario.countDocuments(query),
        Usuario.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.json({
        ok:true,
        total,
        usuarios
    });
  };

 const usuariosPut = async(req = request, res = response) => {

    const {id} = req.params;
    const {_id,password,google,correo,...resto} = req.body;

    //validar contra bd

    if(password){
        const salt = bcrypt.genSaltSync();
        resto.password = bcrypt.hashSync(password,salt);
    };

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.status(400).json({
        ok:true,
        usuario
    });
  };

 const usuariosPost = async(req = request, res = response) => {

    const {nombre,correo,password,rol} = req.body;
    const usuario = new Usuario({nombre,correo,password,rol});   

    //encriptar la contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password,salt);

    //guardar en db
    await usuario.save();

    
    res.status(201).json({
        ok:true,
        usuario
    });
  };

 const usuariosDelete = async(req = request, res = response) => {

    const {id} = req.params;

    //fisicamente delete
    // const usuario = await Usuario.findByIdAndDelete(id);

    const usuario = await Usuario.findByIdAndUpdate(id, {estado:false});


    res.status(400).json({
        ok:true,
        usuario
    });
  };

 const usuariosPatch = (req = request, res = response) => {
    res.status(400).json({
        ok:true,
        msg:'PATCH Epa - Controller'
    });
  };

  module.exports = {
      usuariosGet,
      usuariosPost,
      usuariosPut,
      usuariosDelete,
      usuariosPatch
  };