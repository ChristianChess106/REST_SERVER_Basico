const express = require('express');
let cors = require('cors');
const { dbConnection } = require('../database/config');

class Server{

    constructor(){

        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';
        this.authPath = '/api/auth';

        //Conexion DB
        this.conectarDB();

        //Middlewares
        this.middlewares();

        //Rutas de mi App
        this.routes();

    };

    async conectarDB(){
        await dbConnection();
    };

    middlewares(){

        //CORS
        this.app.use(cors());

        //Parseo y lectura del body
        this.app.use(express.json());

        //Directorio Publico
        this.app.use(express.static('public'));

    };

    routes(){

       this.app.use(this.usuariosPath, require('../routes/user'));
       this.app.use(this.authPath, require('../routes/auth'));
    };

    listen(){
        this.app.listen(this.port, () =>{
            console.log('Servidor corriendo en puerto', this.port);
        });
    }


};

module.exports = Server