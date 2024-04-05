import { Router } from "express";
import { informativo } from "../middlewares";
import { CreateUserController, ListUserController, LoginUserController, UpdatePasswordController, UpdateUserController } from "../controllers/users/controller";



const userRoutes = Router();

const createUserController  = new CreateUserController();
const listUserController  = new ListUserController();
const loginUserController  = new LoginUserController();
const updateUserController  = new UpdateUserController();
const updatePasswordController  = new UpdatePasswordController();



userRoutes.post('/cadastra', informativo, createUserController.handle);
userRoutes.get('/listaUsuarios', informativo, listUserController.handle);
userRoutes.get('/login', informativo, loginUserController.handle);
userRoutes.patch('/atualizaDados', informativo, updateUserController.handle);
userRoutes.patch('/atualizaSenha', informativo, updatePasswordController.handle);


export { userRoutes };
