import { Router } from "express";
import { informativo } from "../middlewares";
import { verificaJWT } from "../middlewares/verificaJWT";
import { CreateInscricaoController } from "../controllers/inscricao/controller";



const inscricaoRoutes = Router();

const createInscricaoController  = new CreateInscricaoController();



inscricaoRoutes.post('/inscrever', informativo, verificaJWT, createInscricaoController.handle);


export { inscricaoRoutes };
