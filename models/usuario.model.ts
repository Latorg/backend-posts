
import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';


const usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    avatar: {
        type: String,
        default: 'av-1.png'
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        require: [true, 'La constraseña es necesaria']
    }
});

usuarioSchema.method('compararPassword', function( password: string = ""): boolean {
    return bcrypt.compareSync( password, this.password );
})

interface IUsuario extends Document {
    nombre: string;
    avatar: string;
    email: string;
    password: string;

    compararPassword(password: string): boolean;
}

export const Usuario = model<IUsuario>('Usuario', usuarioSchema);