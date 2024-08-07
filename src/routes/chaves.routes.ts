import { Router } from "express";
import { informativo } from "../middlewares";
import { verificaJWT } from "../middlewares/verificaJWT";
import { AtualizarPlacarController, GerarChaveController, LimparChaveController, ListarChavesController } from "../controllers/chaves/controller";



const chavesRoutes = Router();

const gerarChaveController  = new GerarChaveController();
const limparChaveController = new LimparChaveController();
const listarChavesController = new ListarChavesController();
const atualizarPlacarController = new AtualizarPlacarController();



chavesRoutes.get('/gerarChaves', informativo, verificaJWT, gerarChaveController.handle);
chavesRoutes.get('/limparChaves', informativo, verificaJWT, limparChaveController.handle);
chavesRoutes.get('/listarChaves', informativo, listarChavesController.handle);
chavesRoutes.patch('/atualizarPlacar', informativo, verificaJWT, atualizarPlacarController.handle);



export { chavesRoutes }
