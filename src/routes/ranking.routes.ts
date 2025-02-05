import { Router } from "express";
import { informativo } from "../middlewares";
import { verificaJWT } from "../middlewares/verificaJWT";
import { AtualizarClasseController, CriarClasseController, ListarClassesController } from "../controllers/classes/controller";
import { CriarRankingController, ListarRankingClassesController, ListarRankingController } from "../controllers/ranking/controller";



const RankingRoutes = Router();

const listarRankingController  = new ListarRankingController();
const listarRankingClassesController  = new ListarRankingClassesController();
const criarRankingController  = new CriarRankingController();


RankingRoutes.get('/listar', informativo, verificaJWT, listarRankingController.handle);
RankingRoutes.get('/listarClasses', informativo, verificaJWT, listarRankingClassesController.handle);
RankingRoutes.post('/criar', informativo, verificaJWT, criarRankingController.handle);


export { RankingRoutes };
