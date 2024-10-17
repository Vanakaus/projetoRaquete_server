import { Router } from "express";
import { informativo } from "../middlewares";
import { verificaJWT } from "../middlewares/verificaJWT";
import { AtualizaHorarioController, CriaHorarioController, DeletaHorarioController, ListaHorariosController } from "../controllers/horarios/controller";



const horariosRoutes = Router();

const criaHorarioController  = new CriaHorarioController();
const listaHorariosController  = new ListaHorariosController();
const atualizaHorarioController  = new AtualizaHorarioController();
const deletaHorarioController  = new DeletaHorarioController();



horariosRoutes.post('/criaHorario', informativo, verificaJWT, criaHorarioController.handle);
horariosRoutes.get('/listaHorarios', informativo, verificaJWT, listaHorariosController.handle);
horariosRoutes.patch('/atualizaHorario', informativo, verificaJWT, atualizaHorarioController.handle);
horariosRoutes.delete('/deletaHorario', informativo, verificaJWT, deletaHorarioController.handle);


export { horariosRoutes };
