"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./classes/server"));
const usuario_1 = __importDefault(require("./routes/usuario"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const post_1 = __importDefault(require("./routes/post"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cors_1 = __importDefault(require("cors"));
const mysql_1 = __importDefault(require("mysql"));
const server = new server_1.default();
// Body parse
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
// FileUpload
server.app.use(express_fileupload_1.default({ useTempFiles: true }));
// Congifurar Cors
server.app.use(cors_1.default({ origin: true, credentials: true }));
server.app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
//Rutas de mi App
server.app.use('/user', usuario_1.default);
server.app.use('/posts', post_1.default);
// Conectar DB
mongoose_1.default.connect('mongodb://localhost:27017/fotosgram', { useNewUrlParser: true, useCreateIndex: true }, (err) => {
    if (err)
        throw err;
    console.log('Base de datos ONLINE');
});
// Conectar MySQL
const connection = mysql_1.default.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "bd_clinicas"
});
connection.connect(err => {
    if (err)
        throw err;
    console.log("Base de datos MYSQL ONLINE");
});
connection.query('SELECT * FROM tb_Fichas WHERE IDFicha <= 2', function (err, result) {
    if (err)
        throw err;
    for (let ficha in result) {
        console.log('The solution is: ', ficha);
    }
});
//Levantar Express
server.start(() => console.log(`Servidor corriendo en puerto ${server.port}`));
