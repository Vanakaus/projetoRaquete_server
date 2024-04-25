import { Router } from "express";
import { informativo } from "../middlewares";
import { CreateUserController, ListUserController, LoginUserController, UpdatePasswordController, UpdateUserController, VerificaJWTController } from "../controllers/users/controller";
import { verificaJWT } from "../middlewares/verificaJWT";



const userRoutes = Router();

const createUserController  = new CreateUserController();
const listUserController  = new ListUserController();
const loginUserController  = new LoginUserController();
const updateUserController  = new UpdateUserController();
const updatePasswordController  = new UpdatePasswordController();
const verificaJWTController  = new VerificaJWTController();



userRoutes.post('/cadastra', informativo, createUserController.handle);
userRoutes.get('/listaUsuarios', informativo, verificaJWT, listUserController.handle);
userRoutes.post('/login', informativo, loginUserController.handle);
userRoutes.patch('/atualizaDados', informativo, verificaJWT, updateUserController.handle);
userRoutes.patch('/atualizaSenha', informativo, verificaJWT, updatePasswordController.handle);
userRoutes.get('/verificaJWT', informativo, verificaJWT, verificaJWTController.handle);


export { userRoutes };
