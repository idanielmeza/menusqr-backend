const express = require('express');
const cors = require('cors');
const {connection} = require('../db/dbConnection');

class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT || 5000;

        this.paths = {
            categorias: '/categorias',
            productos: '/productos',
            usuarios: '/usuarios',
            auth: '/auth'
        }

        this.db()
        this.middleware();
        this.routes();
    }

    db(){
        this.app.use((req,res,next)=>{
            res.locals.db = connection
            next();
        })
    }

    middleware(){
        this.app.use(cors());
        this.app.use(express.json())
    }

    routes(){
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.productos, require('../routes/productos'));
        this.app.use(this.paths.usuarios, require('../routes/users'));
        this.app.use(this.paths.auth, require('../routes/auth'))
    }

    listen(){
        this.app.listen(this.port , ()=>{
            console.log(`Server listen on port ${this.port}`)
        })
    }
}

module.exports = Server;