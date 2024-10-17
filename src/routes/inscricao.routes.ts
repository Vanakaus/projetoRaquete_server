import { Router } from "express";
import { informativo } from "../middlewares";
import { verificaJWT } from "../middlewares/verificaJWT";
import { CriaInscricaoController, ListaInscricoesCampeonatoController, ListaInscricoesController } from "../controllers/inscricao/controller";



const inscricaoRoutes = Router();

const criaInscricaoController  = new CriaInscricaoController();
const listaInscricoesController = new ListaInscricoesController();
const listaInscricoesCampeonatoController = new ListaInscricoesCampeonatoController();



inscricaoRoutes.post('/inscrever', informativo, verificaJWT, criaInscricaoController.handle);
inscricaoRoutes.get('/listaInscricoes', informativo, verificaJWT, listaInscricoesController.handle);
inscricaoRoutes.get('/listaInscricoesCampeonato', informativo, verificaJWT, listaInscricoesCampeonatoController.handle);


export { inscricaoRoutes };
