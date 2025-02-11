import { Router } from "express";
import { informativo } from "../middlewares";
import { verificaJWT } from "../middlewares/verificaJWT";
import { AdicionarInscricoesController, ListaInscricoesCampeonatoController, ListaInscricoesController } from "../controllers/inscricao/controller";



const inscricaoRoutes = Router();

const adicionarInscricoesController  = new AdicionarInscricoesController();
const listaInscricoesController = new ListaInscricoesController();
const listaInscricoesCampeonatoController = new ListaInscricoesCampeonatoController();



inscricaoRoutes.post('/adicionar', informativo, verificaJWT, adicionarInscricoesController.handle);

// inscricaoRoutes.get('/listaInscricoes', informativo, verificaJWT, listaInscricoesController.handle);
// inscricaoRoutes.get('/listaInscricoesCampeonato', informativo, verificaJWT, listaInscricoesCampeonatoController.handle);


export { inscricaoRoutes };
