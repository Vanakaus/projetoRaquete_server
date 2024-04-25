import { Router } from "express";
import { informativo } from "../middlewares";
import { CreateUserController, ListUserController, LoginUserController, UpdatePasswordController, UpdateUserController } from "../controllers/users/controller";
import { verificaJWT } from "../middlewares/verificaJWT";



const userRoutes = Router();

const createUserController  = new CreateUserController();
const listUserController  = new ListUserController();
const loginUserController  = new LoginUserController();
const updateUserController  = new UpdateUserController();
const updatePasswordController  = new UpdatePasswordController();



userRoutes.post('/cadastra', informativo, createUserController.handle);
userRoutes.get('/listaUsuarios', informativo, verificaJWT, listUserController.handle);
userRoutes.post('/login', informativo, loginUserController.handle);
userRoutes.patch('/atualizaDados', informativo, verificaJWT, updateUserController.handle);
userRoutes.patch('/atualizaSenha', informativo, verificaJWT, updatePasswordController.handle);


export { userRoutes };
