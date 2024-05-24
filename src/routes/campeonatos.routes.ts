import { Router } from "express";
import { informativo } from "../middlewares";
import { CreateCampeonatoController, LeCampeonatoController, LeCampeonatoCriadoController, ListaCampeonatosController, ListaCampeonatosCriadosController } from "../controllers/campeonatos/controller";
import { verificaJWT } from "../middlewares/verificaJWT";



const campenatoRoutes = Router();

const createCampeonatoController  = new CreateCampeonatoController();
const listaCampeonatoController = new ListaCampeonatosController();
const listaCampeonatosCriadosController = new ListaCampeonatosCriadosController();
const leCampeonatoController = new LeCampeonatoController();
const leCampeonatoCriadoController = new LeCampeonatoCriadoController();



campenatoRoutes.post('/cadastra', informativo, verificaJWT, createCampeonatoController.handle);
campenatoRoutes.get('/listaCampeonatos', informativo, listaCampeonatoController.handle);
campenatoRoutes.get('/listaCampeonatosCriados', informativo, verificaJWT, listaCampeonatosCriadosController.handle);
campenatoRoutes.get('/leCampeonato', informativo, leCampeonatoController.handle);
campenatoRoutes.get('/leCampeonatoCriado', informativo, verificaJWT, leCampeonatoCriadoController.handle);


export { campenatoRoutes };
