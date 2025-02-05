import { Router } from "express";
import { informativo } from "../middlewares";
import { verificaJWT } from "../middlewares/verificaJWT";
import { AdicionarClasseRankingController, AtualizarClasseController, CriarClasseController, ListarClassesController } from "../controllers/classes/controller";



const classesRoutes = Router();

const listarClasseController  = new ListarClassesController();
const criarClasseController  = new CriarClasseController();
const atualizaClasseController  = new AtualizarClasseController();
const adicionarClasseRankingController  = new AdicionarClasseRankingController();


classesRoutes.get('/listar', informativo, verificaJWT, listarClasseController.handle);
classesRoutes.post('/criar', informativo, verificaJWT, criarClasseController.handle);
classesRoutes.patch('/atualizar', informativo, verificaJWT, atualizaClasseController.handle);
classesRoutes.post('/adicionarClasseRanking', informativo, verificaJWT, adicionarClasseRankingController.handle);

// userRoutes.get('/verificaJWT', informativo, verificaJWT, verificaJWTController.handle);
// userRoutes.patch('/atualizaSenha', informativo, verificaJWT, atualizaPasswordController.handle);


export { classesRoutes };
