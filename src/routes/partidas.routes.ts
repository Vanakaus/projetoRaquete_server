import { Router } from "express";
import { informativo } from "../middlewares";
import { verificaJWT } from "../middlewares/verificaJWT";
import { AtualizarDadosController, AtualizarPlacarController, GerarChaveController, LimparChaveController, ListarChavesController, ListarProximasPartidasController } from "../controllers/chaves/controller";



const partidasRoutes = Router();

const gerarChaveController  = new GerarChaveController();
const limparChaveController = new LimparChaveController();
const listarChavesController = new ListarChavesController();
const atualizarPlacarController = new AtualizarPlacarController();
const atualizarDadosController = new AtualizarDadosController();
const listarProximasPartidasController = new ListarProximasPartidasController();



partidasRoutes.post('/gerarChave', informativo, verificaJWT, gerarChaveController.handle);
partidasRoutes.post('/limparChave', informativo, verificaJWT, limparChaveController.handle);
partidasRoutes.get('/listar', informativo, listarChavesController.handle);

partidasRoutes.patch('/atualizarDados', informativo, verificaJWT, atualizarDadosController.handle);
partidasRoutes.patch('/atualizarPlacar', informativo, verificaJWT, atualizarPlacarController.handle);

// partidasRoutes.get('/proximasPartidas', informativo, listarProximasPartidasController.handle);



export { partidasRoutes }
