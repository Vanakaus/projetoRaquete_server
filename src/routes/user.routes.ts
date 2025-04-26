import { Router } from "express";
import { informativo } from "../middlewares";
import { AtualizaSenhaController, CriaAcademiaController, CriaUsuarioController, LeAcademiaController, LoginUserController, VerificaJWTController } from "../controllers/users/controller";
import { verificaJWT } from "../middlewares/verificaJWT";



const userRoutes = Router();

const loginUserController  = new LoginUserController();
const verificaJWTController  = new VerificaJWTController();

const criaAcademiaController  = new CriaAcademiaController();
const leAcademiaController  = new LeAcademiaController();
const criaUsuarioController  = new CriaUsuarioController();
const atualizaSenhaController  = new AtualizaSenhaController();



userRoutes.post('/cadastrarAcademia', informativo, criaAcademiaController.handle);
userRoutes.post('/cadastrarUsuario', informativo, criaUsuarioController.handle);
userRoutes.patch('/atualizarSenha', informativo, verificaJWT, atualizaSenhaController.handle);

userRoutes.post('/login', informativo, loginUserController.handle);
userRoutes.get('/leAcademia', informativo, verificaJWT, leAcademiaController.handle);
userRoutes.get('/verificaJWT', informativo, verificaJWT, verificaJWTController.handle);


export { userRoutes };
