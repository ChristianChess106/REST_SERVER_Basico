const {response, request} = require('express');


const usuariosGet = (req = request, res = response) => {

    const {q,nombre,apikey} = req.query;

    res.json({
        ok:true,
        q,
        nombre,
        apikey
    });
  };

 const usuariosPut = (req = request, res = response) => {

    const id = req.params.id;

    res.status(400).json({
        ok:true,
        id
    });
  };

 const usuariosPost = (req = request, res = response) => {

    const {nombre,edad} = req.body;
    
    res.status(400).json({
        ok:true,
        nombre,
        edad
    });
  };

 const usuariosDelete = (req = request, res = response) => {
    res.status(400).json({
        ok:true,
        msg:'POST Epa - Controller'
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