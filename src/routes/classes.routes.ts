import { Router } from "express";
import { informativo } from "../middlewares";
import { verificaJWT } from "../middlewares/verificaJWT";
import { CriarClasseController, ListarClassesController } from "../controllers/classes/controller";



const classesRoutes = Router();

const listarClasseController  = new ListarClassesController();
const criarClasseController  = new CriarClasseController();



classesRoutes.get('/listar', informativo, verificaJWT, listarClasseController.handle);
classesRoutes.post('/criar', informativo, verificaJWT, criarClasseController.handle);

// userRoutes.get('/verificaJWT', informativo, verificaJWT, verificaJWTController.handle);
// userRoutes.patch('/atualizaSenha', informativo, verificaJWT, atualizaPasswordController.handle);


export { classesRoutes };
