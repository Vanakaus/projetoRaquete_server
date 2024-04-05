import { Router } from "express";
import { informativo } from "../middlewares";
import { CreateUserController, ListUserController, LoginUserController } from "../controllers/users/controller";



const userRoutes = Router();
const createUserController  = new CreateUserController();
const listUserController  = new ListUserController();
const loginUserController  = new LoginUserController();


// userRoutes.post('/cria', createUserController.handle);
userRoutes.post('/cadastra', informativo, createUserController.handle);
userRoutes.get('/listaUsuarios', informativo, listUserController.handle);
userRoutes.get('/login', informativo, loginUserController.handle);


export { userRoutes };
