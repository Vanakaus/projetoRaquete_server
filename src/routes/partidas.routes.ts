import { Router } from "express";
import { informativo } from "../middlewares";
import { verificaJWT } from "../middlewares/verificaJWT";
import { AtualizarDatasController, AtualizarPlacarController, GerarChaveController, LimparChaveController, ListarChavesController, ListarProximasPartidasController } from "../controllers/chaves/controller";



const partidasRoutes = Router();

const gerarChaveController  = new GerarChaveController();
const limparChaveController = new LimparChaveController();
const listarChavesController = new ListarChavesController();
const atualizarPlacarController = new AtualizarPlacarController();
const atualizarDatasController = new AtualizarDatasController();
const listarProximasPartidasController = new ListarProximasPartidasController();



partidasRoutes.get('/gerarChaves', informativo, verificaJWT, gerarChaveController.handle);
partidasRoutes.get('/limparChaves', informativo, verificaJWT, limparChaveController.handle);
partidasRoutes.get('/listarChaves', informativo, listarChavesController.handle);

partidasRoutes.patch('/atualizarPlacar', informativo, verificaJWT, atualizarPlacarController.handle);
partidasRoutes.patch('/atualizarDatas', informativo, verificaJWT, atualizarDatasController.handle);

partidasRoutes.get('/proximasPartidas', informativo, listarProximasPartidasController.handle);



export { partidasRoutes }
