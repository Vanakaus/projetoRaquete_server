import { Router } from "express";
import { informativo } from "../middlewares";
import { CreateCampeonatoController, ListCampeonatoController } from "../controllers/campeonatos/controller";



const campenatoRoutes = Router();

const createCampeonatoController  = new CreateCampeonatoController();
const listaCampeonatoController = new ListCampeonatoController();



campenatoRoutes.post('/cadastra', informativo, createCampeonatoController.handle);
campenatoRoutes.get('/listaCampeonatos', informativo, listaCampeonatoController.handle);


export { campenatoRoutes };
