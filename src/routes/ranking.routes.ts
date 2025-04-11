import { Router } from "express";
import { informativo } from "../middlewares";
import { verificaJWT } from "../middlewares/verificaJWT";
import { CriarRankingController, ListarRankingClassesController, ListarRankingController, RankingController } from "../controllers/ranking/controller";



const rankingRoutes = Router();

const listarRankingController  = new ListarRankingController();
const listarRankingClassesController  = new ListarRankingClassesController();
const criarRankingController  = new CriarRankingController();
const rankingController  = new RankingController();


rankingRoutes.get('/listar', informativo, listarRankingController.handle);
rankingRoutes.get('/listarClasses', informativo, listarRankingClassesController.handle);
rankingRoutes.post('/criar', informativo, verificaJWT, criarRankingController.handle);

rankingRoutes.get('/ranking', informativo, rankingController.handle);


export { rankingRoutes };
