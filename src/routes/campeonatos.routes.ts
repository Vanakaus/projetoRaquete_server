import { Router } from "express";
import { informativo } from "../middlewares";
import { AtualizaCampeonatoController, CriaCampeonatoController, LeCampeonatoController, LeCampeonatoCriadoController, ListaCampeonatosController, ListaCampeonatosCriadosController } from "../controllers/campeonatos/controller";
import { verificaJWT } from "../middlewares/verificaJWT";



const campenatoRoutes = Router();

const atualizaCampeonatoController = new AtualizaCampeonatoController();
const criaCampeonatoController  = new CriaCampeonatoController();
const leCampeonatoController = new LeCampeonatoController();
const leCampeonatoCriadoController = new LeCampeonatoCriadoController();
const listaCampeonatoController = new ListaCampeonatosController();
const listaCampeonatosCriadosController = new ListaCampeonatosCriadosController();



campenatoRoutes.patch('/atualizaCampeonato', informativo, verificaJWT, atualizaCampeonatoController.handle);
campenatoRoutes.post('/cadastra', informativo, verificaJWT, criaCampeonatoController.handle);
campenatoRoutes.get('/listaCampeonatos', informativo, listaCampeonatoController.handle);
campenatoRoutes.get('/listaCampeonatosCriados', informativo, verificaJWT, listaCampeonatosCriadosController.handle);
campenatoRoutes.get('/leCampeonato', informativo, leCampeonatoController.handle);
campenatoRoutes.get('/leCampeonatoCriado', informativo, verificaJWT, leCampeonatoCriadoController.handle);


export { campenatoRoutes };
