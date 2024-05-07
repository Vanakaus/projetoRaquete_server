import { Router } from "express";
import { informativo } from "../middlewares";
import { verificaJWT } from "../middlewares/verificaJWT";
import { CreateCampeonatoController } from "../controllers/campeonatos/controller";



const campenatoRoutes = Router();

const createCampeonatoController  = new CreateCampeonatoController();



campenatoRoutes.post('/cadastra', informativo, createCampeonatoController.handle);


export { campenatoRoutes };
