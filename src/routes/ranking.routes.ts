import { Router } from "express";
import { informativo } from "../middlewares";
import { verificaJWT } from "../middlewares/verificaJWT";
import { AtualizarClasseController, CriarClasseController, ListarClassesController } from "../controllers/classes/controller";
import { CriarRankingController, ListarRankingClassesController, ListarRankingController } from "../controllers/ranking/controller";



const rankingRoutes = Router();

const listarRankingController  = new ListarRankingController();
const listarRankingClassesController  = new ListarRankingClassesController();
const criarRankingController  = new CriarRankingController();


rankingRoutes.get('/listar', informativo, verificaJWT, listarRankingController.handle);
rankingRoutes.get('/listarClasses', informativo, verificaJWT, listarRankingClassesController.handle);
rankingRoutes.post('/criar', informativo, verificaJWT, criarRankingController.handle);


export { rankingRoutes };
