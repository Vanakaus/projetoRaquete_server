import { Router } from "express";
import { informativo } from "../middlewares";
import { AtualizaSenhaController, CriaAcademiaController, CriaUsuarioController, LoginUserController, VerificaJWTController } from "../controllers/users/controller";
import { verificaJWT } from "../middlewares/verificaJWT";



const userRoutes = Router();

const loginUserController  = new LoginUserController();
const verificaJWTController  = new VerificaJWTController();

const criaAcademiaController  = new CriaAcademiaController();
const criaUsuarioController  = new CriaUsuarioController();
const atualizaSenhaController  = new AtualizaSenhaController();



userRoutes.post('/cadastrarAcademia', informativo, criaAcademiaController.handle);
userRoutes.post('/cadastrarUsuario', informativo, criaUsuarioController.handle);
userRoutes.patch('/atualizarSenha', informativo, verificaJWT, atualizaSenhaController.handle);

userRoutes.post('/login', informativo, loginUserController.handle);
userRoutes.get('/verificaJWT', informativo, verificaJWT, verificaJWTController.handle);

// userRoutes.post('/cadastra', informativo, criaUserController.handle);
// userRoutes.get('/listaUsuarios', informativo, verificaJWT, listUserController.handle);
// userRoutes.patch('/atualizaDados', informativo, verificaJWT, atualizaUserController.handle);
// userRoutes.patch('/atualizaSenha', informativo, verificaJWT, atualizaPasswordController.handle);


export { userRoutes };
