// general imports
const express = require('express');
require('dotenv').config();
const mongooseConfig = require('./src/database/mongooseConfig');

// import routes
const homeRoutes = require('./src/routes/homeRoutes');
const personRoutes = require('./src/routes/personRoutes');

class Server {
    constructor() {
        this.app = express();
        this.middlewares();
        this.routes();
        this.connection();
    }

    middlewares() {
        this.app.use(express.urlencoded({extended: true}));
        this.app.use(express.json());
    }

    routes() {
        this.app.use('/', homeRoutes);
        this.app.use('/person/', personRoutes);
    }

    async connection() {
        try{
            await mongooseConfig.connect();
            console.log('Connection established with MongoDB!');
            this.app.listen(process.env.CONNECTIONPORT, () => {
                    console.log();
                    console.log('Connection established with localhost.');
            })
        } catch(err) {
            console.log(err);
        }
    }
}

const server = new Server();
