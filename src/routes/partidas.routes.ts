import { Router } from "express";
import { informativo } from "../middlewares";
import { verificaJWT } from "../middlewares/verificaJWT";
import { AtualizarDatasController, AtualizarPlacarController, GerarChaveController, LimparChaveController, ListarChavesController } from "../controllers/chaves/controller";



const poartidasRoutes = Router();

const gerarChaveController  = new GerarChaveController();
const limparChaveController = new LimparChaveController();
const listarChavesController = new ListarChavesController();
const atualizarPlacarController = new AtualizarPlacarController();
const atualizarDatasController = new AtualizarDatasController();



poartidasRoutes.get('/gerarChaves', informativo, verificaJWT, gerarChaveController.handle);
poartidasRoutes.get('/limparChaves', informativo, verificaJWT, limparChaveController.handle);
poartidasRoutes.get('/listarChaves', informativo, listarChavesController.handle);
poartidasRoutes.patch('/atualizarPlacar', informativo, verificaJWT, atualizarPlacarController.handle);
poartidasRoutes.patch('/atualizarDatas', informativo, verificaJWT, atualizarDatasController.handle);



export { poartidasRoutes }
