import { Router } from "express";
import { informativo } from "../middlewares";
import { AbreFechaInscricoesController, AtualizaCampeonatoController, CriaCampeonatoController, FinalizaCampeonatoController, LeCampeonatoController, LeCampeonatoCriadoController, ListaCampeonatosController, ListaCampeonatosCriadosController, ReabrirCampeonatoController } from "../controllers/campeonatos/controller";
import { verificaJWT } from "../middlewares/verificaJWT";
import { ReabrirCampeonatoUseCase } from "../controllers/campeonatos/reabrirCampeonato";



const campenatoRoutes = Router();

const atualizaCampeonatoController = new AtualizaCampeonatoController();
const criaCampeonatoController  = new CriaCampeonatoController();
const leCampeonatoController = new LeCampeonatoController();
const leCampeonatoCriadoController = new LeCampeonatoCriadoController();
const listaCampeonatoController = new ListaCampeonatosController();
const listaCampeonatosCriadosController = new ListaCampeonatosCriadosController();
const abreFechaInscricoesController = new AbreFechaInscricoesController();
const finalizaCampeonato = new FinalizaCampeonatoController();
const reabrirCampeonato = new ReabrirCampeonatoController();



campenatoRoutes.patch('/atualizaCampeonato', informativo, verificaJWT, atualizaCampeonatoController.handle);
campenatoRoutes.post('/cadastra', informativo, verificaJWT, criaCampeonatoController.handle);

campenatoRoutes.get('/listaCampeonatos', informativo, listaCampeonatoController.handle);
campenatoRoutes.get('/listaCampeonatosCriados', informativo, verificaJWT, listaCampeonatosCriadosController.handle);
campenatoRoutes.get('/leCampeonato', informativo, leCampeonatoController.handle);
campenatoRoutes.get('/leCampeonatoCriado', informativo, verificaJWT, leCampeonatoCriadoController.handle);

campenatoRoutes.patch('/abreFechaInscricoes', informativo, verificaJWT, abreFechaInscricoesController.handle);
campenatoRoutes.patch('/finalizarCampeonato', informativo, verificaJWT, finalizaCampeonato.handle);
campenatoRoutes.patch('/reabrirCampeonato', informativo, verificaJWT, reabrirCampeonato.handle);


export { campenatoRoutes };
