import { Router } from "express";
import { informativo } from "../middlewares";
import { CreateUserController, ListUserController } from "../controllers/users/controller";



const createUserController  = new CreateUserController();
const listUserController  = new ListUserController();
const userRoutes = Router();


// userRoutes.post('/cria', createUserController.handle);
userRoutes.post('/cadastra', informativo, createUserController.handle);
userRoutes.get('/listaUsuarios', informativo, listUserController.handle);


export { userRoutes };
