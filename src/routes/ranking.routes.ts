import { Router } from "express";
import { informativo } from "../middlewares";
import { verificaJWT } from "../middlewares/verificaJWT";
import { AtualizarClasseController, CriarClasseController, ListarClassesController } from "../controllers/classes/controller";
import { CriarRankingController, ListarRankingController } from "../controllers/ranking/controller";



const RankingRoutes = Router();

const listarRankingController  = new ListarRankingController();
const criarRankingController  = new CriarRankingController();


RankingRoutes.get('/listar', informativo, verificaJWT, listarRankingController.handle);
RankingRoutes.post('/criar', informativo, verificaJWT, criarRankingController.handle);


export { RankingRoutes };
