import mongoose from "mongoose";
import config from "../config/database.js";

const conexion = async () => {
    try {
        await mongoose.connect(config.mongoURL);
        console.log(`Conectado`);
    } catch (error) {
        console.log(`Error en la funcion : ${error}`);
        //  throw new Error(error);
    }
};

export default conexion;