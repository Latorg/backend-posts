"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticate_1 = require("../middlewares/authenticate");
const post_model_1 = require("../models/post.model");
const file_system_1 = __importDefault(require("../classes/file-system"));
const postRoutes = express_1.Router();
const fileSystem = new file_system_1.default();
//Obtener POSRT PAGINADO
postRoutes.get('/', async (req, res) => {
    let pagina = Number(req.query.pagina) || 1;
    const posts = await post_model_1.Post.find()
        .sort({ _id: -1 })
        .skip((pagina - 1) * 10)
        .limit(10)
        .populate('usuario', '-password ')
        .exec();
    res.json({
        ok: true,
        pagina,
        posts
    });
});
//CREAR POST
postRoutes.post('/', [authenticate_1.verificarToken], (req, res) => {
    const body = req.body;
    body.usuario = req.usuario._id;
    const imagenes = fileSystem.imagenesDeTempHaciaPost(req.usuario._id);
    body.imgs = imagenes;
    post_model_1.Post.create(body).then(async (postDB) => {
        await postDB.populate('usuario', '-password ').execPopulate();
        res.json({
            ok: true,
            post: postDB
        });
    }).catch(err => {
        res.json(err);
    });
});
// SERVICIO PARA SUBIR ARCHIVOS
postRoutes.post('/upload', [authenticate_1.verificarToken], async (req, res) => {
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subió ningun archivo'
        });
    }
    const file = req.files.image;
    if (!file) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subió ningun archivo - image'
        });
    }
    if (!file.mimetype.includes('image')) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Lo que subió no es un imagen'
        });
    }
    await fileSystem.guardarImagenTemporal(file, req.usuario._id);
    res.json({
        ok: true,
        file: file.mimetype
    });
});
//Obtener POSRT PAGINADO
postRoutes.get('/imagen/:userid/:img', (req, res) => {
    const userId = req.params.userid;
    const img = req.params.img;
    const pathFoto = fileSystem.getFotoUrl(userId, img);
    res.sendFile(pathFoto);
});
exports.default = postRoutes;
