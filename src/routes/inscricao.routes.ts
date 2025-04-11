import { Router } from "express";
import { informativo } from "../middlewares";
import { verificaJWT } from "../middlewares/verificaJWT";
import { AdicionarInscricoesController, ListaInscricoesCampeonatoController, ListarInscricoesController } from "../controllers/inscricao/controller";



const inscricaoRoutes = Router();

const adicionarInscricoesController  = new AdicionarInscricoesController();
const listarInscricoesController = new ListarInscricoesController();
const listaInscricoesCampeonatoController = new ListaInscricoesCampeonatoController();



inscricaoRoutes.post('/adicionar', informativo, verificaJWT, adicionarInscricoesController.handle);
inscricaoRoutes.get('/listar', informativo, listarInscricoesController.handle);

// inscricaoRoutes.get('/listaInscricoesCampeonato', informativo, verificaJWT, listaInscricoesCampeonatoController.handle);


export { inscricaoRoutes };
