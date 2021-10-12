const express = require('express');
let cors = require('cors');
const { dbConnection } = require('../database/config');

class Server{

    constructor(){

        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth:'/api/auth',
            buscar: '/api/buscar',
            categorias:'/api/categorias',
            productos:'/api/productos',
            usuarios:'/api/usuarios',
        }
       

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

       this.app.use(this.paths.auth, require('../routes/auth'));
       this.app.use(this.paths.buscar, require('../routes/buscar'));
       this.app.use(this.paths.usuarios, require('../routes/user'));
       this.app.use(this.paths.categorias, require('../routes/categorias'));
       this.app.use(this.paths.productos, require('../routes/productos'));
    };

    listen(){
        this.app.listen(this.port, () =>{
            console.log('Servidor corriendo en puerto', this.port);
        });
    }


};

module.exports = Server