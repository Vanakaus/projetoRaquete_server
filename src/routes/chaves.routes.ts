import { Router } from "express";
import { informativo } from "../middlewares";
import { verificaJWT } from "../middlewares/verificaJWT";
import { GerarChaveController, LimparChaveController, ListarChavesController } from "../controllers/chaves/controller";



const chavesRoutes = Router();

const gerarChaveController  = new GerarChaveController();
const limparChaveController = new LimparChaveController();
const listarChavesController = new ListarChavesController();



chavesRoutes.get('/gerarChaves', informativo, verificaJWT, gerarChaveController.handle);
chavesRoutes.get('/limparChaves', informativo, verificaJWT, limparChaveController.handle);
chavesRoutes.get('/listarChaves', informativo, verificaJWT, listarChavesController.handle);



export { chavesRoutes }
