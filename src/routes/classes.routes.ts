import { Router } from "express";
import { informativo } from "../middlewares";
import { verificaJWT } from "../middlewares/verificaJWT";
import { AdicionarClasseRankingController, AtualizarClasseController, ContarJogadoresClasseController, CriarClasseController, ListarClassesController } from "../controllers/classes/controller";



const classesRoutes = Router();

const listarClasseController  = new ListarClassesController();
const criarClasseController  = new CriarClasseController();
const atualizaClasseController  = new AtualizarClasseController();
const adicionarClasseRankingController  = new AdicionarClasseRankingController();
const contarJogadoresClasseController  = new ContarJogadoresClasseController();


classesRoutes.get('/listar', informativo, verificaJWT, listarClasseController.handle);
classesRoutes.post('/criar', informativo, verificaJWT, criarClasseController.handle);
classesRoutes.patch('/atualizar', informativo, verificaJWT, atualizaClasseController.handle);
classesRoutes.post('/adicionarClasseRanking', informativo, verificaJWT, adicionarClasseRankingController.handle);

classesRoutes.get('/contarJogadoresClasse', informativo, verificaJWT, contarJogadoresClasseController.handle);


export { classesRoutes };
