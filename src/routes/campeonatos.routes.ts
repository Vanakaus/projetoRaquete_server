import { Router } from "express";
import { informativo } from "../middlewares";
import { CreateCampeonatoController, LeCampeonatoController, ListaCampeonatosController } from "../controllers/campeonatos/controller";



const campenatoRoutes = Router();

const createCampeonatoController  = new CreateCampeonatoController();
const listaCampeonatoController = new ListaCampeonatosController();
const leCampeonatoController = new LeCampeonatoController();



campenatoRoutes.post('/cadastra', informativo, createCampeonatoController.handle);
campenatoRoutes.get('/listaCampeonatos', informativo, listaCampeonatoController.handle);
campenatoRoutes.get('/leCampeonato', informativo, leCampeonatoController.handle);


export { campenatoRoutes };
