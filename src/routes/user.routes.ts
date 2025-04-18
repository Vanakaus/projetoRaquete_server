import { Router } from "express";
import { informativo } from "../middlewares";
import { CriaUserController, ListUserController, LoginUserController, AtualizaPasswordController, AtualizaUserController, VerificaJWTController } from "../controllers/users/controller";
import { verificaJWT } from "../middlewares/verificaJWT";



const userRoutes = Router();

const loginUserController  = new LoginUserController();
const verificaJWTController  = new VerificaJWTController();

const criaUserController  = new CriaUserController();
const listUserController  = new ListUserController();
const atualizaUserController  = new AtualizaUserController();
const atualizaPasswordController  = new AtualizaPasswordController();



userRoutes.post('/login', informativo, loginUserController.handle);
userRoutes.get('/verificaJWT', informativo, verificaJWT, verificaJWTController.handle);

// userRoutes.post('/cadastra', informativo, criaUserController.handle);
// userRoutes.get('/listaUsuarios', informativo, verificaJWT, listUserController.handle);
// userRoutes.patch('/atualizaDados', informativo, verificaJWT, atualizaUserController.handle);
// userRoutes.patch('/atualizaSenha', informativo, verificaJWT, atualizaPasswordController.handle);


export { userRoutes };
