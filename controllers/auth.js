const {request,response, json} = require('express');
const Usuario = require('../models/usuario');
const bcryptJs = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

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

const googleSignIn = async(req = request,res = response) => {

    const {id_token} = req.body;

    try {

        const {nombre,img,correo} = await googleVerify(id_token);

        //verificar si el correo existe en Bd
        let usuario = await Usuario.findOne({correo});

        if(!usuario){
            //tengo que crearlo
            const data = {
                nombre,
                correo,
                password:':P',
                img,
                rol:'USER_ROLE',
                google:true
            };

            usuario = new Usuario(data);
            await usuario.save();
        }

        //Si el Usuario en Db
        if(!usuario.estado){
            return res.status(401).json({
                msg:'hable con el administrador, Usuario bloqueado'
            });
        }

        //generar JWT
         const token = await generarJWT(usuario.id);

        res.json({
          usuario,
          token
        });
        
    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok:false,
            msg:'el token no se pudo verificar'
        });
    }


};


module.exports = {
    login,
    googleSignIn
};