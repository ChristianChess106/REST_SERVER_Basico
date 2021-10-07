const {request,response} = require('express');
const Usuario = require('../models/usuario');
const bcryptJs = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');

const login = async(req = request,res = response) => {

    const {correo,password} = req.body;

    try {

        //verificar si correo existe
        const usuario = await Usuario.findOne({correo});
        if(!usuario){
            return res.status(400).json({
                msg:'Usuario / password no son correctos - correo'
            });
        }

        //si usuario esta activo
        if(!usuario.estado){
            return res.status(400).json({
                msg:'Usuario / password no son correctos - estado:False'
            });
        }

        
        //verificar contraseña
        const validPassword = bcryptJs.compareSync(password,usuario.password);
        if(!validPassword){
            return res.status(400).json({
                msg:'Usuario / password no son correctos - password'
            });
        }


        //generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
           token
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg:'Hable con el administrador'
        })
    }
    

};


module.exports = {
    login
};