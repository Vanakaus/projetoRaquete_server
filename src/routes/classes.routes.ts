import { Router } from "express";
import { informativo } from "../middlewares";
import { verificaJWT } from "../middlewares/verificaJWT";
import { AtualizarClasseController, CriarClasseController, ListarClassesController } from "../controllers/classes/controller";



const classesRoutes = Router();

const listarClasseController  = new ListarClassesController();
const criarClasseController  = new CriarClasseController();
const atualizaClasseController  = new AtualizarClasseController();


classesRoutes.get('/listar', informativo, verificaJWT, listarClasseController.handle);
classesRoutes.post('/criar', informativo, verificaJWT, criarClasseController.handle);
classesRoutes.patch('/atualizar', informativo, verificaJWT, atualizaClasseController.handle);

// userRoutes.get('/verificaJWT', informativo, verificaJWT, verificaJWTController.handle);
// userRoutes.patch('/atualizaSenha', informativo, verificaJWT, atualizaPasswordController.handle);


export { classesRoutes };
