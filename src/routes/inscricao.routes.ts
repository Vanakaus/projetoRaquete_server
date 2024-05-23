import { Router } from "express";
import { informativo } from "../middlewares";
import { verificaJWT } from "../middlewares/verificaJWT";
import { CreateInscricaoController, ListaInscricoesController } from "../controllers/inscricao/controller";



const inscricaoRoutes = Router();

const createInscricaoController  = new CreateInscricaoController();
const listaInscricoesController = new ListaInscricoesController();



inscricaoRoutes.post('/inscrever', informativo, verificaJWT, createInscricaoController.handle);
inscricaoRoutes.get('/listaInscricoes', informativo, verificaJWT, listaInscricoesController.handle);


export { inscricaoRoutes };
