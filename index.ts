import Server from './classes/server';
import userRoutes from './routes/usuario';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import postRoutes from './routes/post';
import fileUpload from 'express-fileupload';
import cors from 'cors';
// import mysql from 'mysql';

const server = new Server();

// Body parse
server.app.use( bodyParser.urlencoded({ extended: true }) );
server.app.use( bodyParser.json() );

// FileUpload
server.app.use( fileUpload({ useTempFiles: true }) );

// Congifurar Cors
server.app.use( cors({ origin: true, credentials: true }) );
server.app.use( (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//Rutas de mi App
server.app.use('/user', userRoutes );
server.app.use('/posts', postRoutes );

// Conectar DB
mongoose.connect('mongodb://localhost:27017/fotosgram', 
                { useNewUrlParser: true, useCreateIndex: true}, ( err ) => {
                    if( err ) throw err;

                    console.log('Base de datos ONLINE');
                })

// Conectar MySQL
// const connection = mysql.createConnection({
//     host        : "localhost",
//     user        : "root",
//     password    : "",
//     database    : "bd_clinicas"
    
// });

// connection.connect( err => {
//     if( err ) throw err;
//     console.log("Base de datos MYSQL ONLINE");
// });


// connection.query('SELECT * FROM tb_Fichas WHERE IDFicha <= 2', function(err, result) {
//     if (err) throw err;
//     for( let ficha in result ){
//         console.log('The solution is: ', result);
//     }
// });


//Levantar Express
server.start( () => console.log(`Servidor corriendo en puerto ${ server.port }`));
