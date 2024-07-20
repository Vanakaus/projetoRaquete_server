import { Router } from "express";
import { informativo } from "../middlewares";
import { verificaJWT } from "../middlewares/verificaJWT";
import { GerarChaveController, LimparChaveController } from "../controllers/chaves/controller";



const chavesRoutes = Router();

const gerarChaveController  = new GerarChaveController();
const limparChaveController = new LimparChaveController();



chavesRoutes.get('/gerarChaves', informativo, verificaJWT, gerarChaveController.handle);
chavesRoutes.get('/limparChaves', informativo, verificaJWT, limparChaveController.handle);



export { chavesRoutes }
