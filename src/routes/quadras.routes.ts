import { Router } from "express";
import { informativo } from "../middlewares";
import { verificaJWT } from "../middlewares/verificaJWT";
import { AtualizaQuadraController, CriaQuadraController, DeletaQuadraController, ListaQuadrasController } from "../controllers/quadras/controller";



const quadrasRoutes = Router();

const criaQuadraController  = new CriaQuadraController();
const listaQuadrasController  = new ListaQuadrasController();
const atualizaQuadraController  = new AtualizaQuadraController();
const deletaQuadraController  = new DeletaQuadraController();



quadrasRoutes.post('/criaQuadra', informativo, verificaJWT, criaQuadraController.handle);
quadrasRoutes.get('/listaQuadras', informativo, verificaJWT, listaQuadrasController.handle);
quadrasRoutes.patch('/atualizaQuadra', informativo, verificaJWT, atualizaQuadraController.handle);
quadrasRoutes.delete('/deletaQuadra', informativo, verificaJWT, deletaQuadraController.handle);


export { quadrasRoutes };
