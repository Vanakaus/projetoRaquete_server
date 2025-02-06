import { Router } from "express";
import { informativo } from "../middlewares";
import { AbreFechaInscricoesController, AtualizaCampeonatoController, CriarCampeonatoController, FinalizaCampeonatoController, LeCampeonatoController, LeCampeonatoCriadoController, ListaCampeonatosController, ListaCampeonatosCriadosController, ListaProximosCampeonatosController, ReabrirCampeonatoController } from "../controllers/campeonatos/controller";
import { verificaJWT } from "../middlewares/verificaJWT";



const torneioRoutes = Router();

const atualizaCampeonatoController = new AtualizaCampeonatoController();
const criarCampeonatoController  = new CriarCampeonatoController();
const leCampeonatoController = new LeCampeonatoController();
const leCampeonatoCriadoController = new LeCampeonatoCriadoController();
const listaCampeonatoController = new ListaCampeonatosController();
const listaCampeonatosCriadosController = new ListaCampeonatosCriadosController();
const abreFechaInscricoesController = new AbreFechaInscricoesController();
const finalizaCampeonato = new FinalizaCampeonatoController();
const reabrirCampeonato = new ReabrirCampeonatoController();
const listaProximosCampeonatoController = new ListaProximosCampeonatosController();



// torneioRoutes.patch('/atualizaCampeonato', informativo, verificaJWT, atualizaCampeonatoController.handle);
torneioRoutes.post('/criar', informativo, verificaJWT, criarCampeonatoController.handle);

// torneioRoutes.get('/listaCampeonatos', informativo, listaCampeonatoController.handle);
// torneioRoutes.get('/listaCampeonatosCriados', informativo, verificaJWT, listaCampeonatosCriadosController.handle);
// torneioRoutes.get('/leCampeonato', informativo, leCampeonatoController.handle);
// torneioRoutes.get('/leCampeonatoCriado', informativo, verificaJWT, leCampeonatoCriadoController.handle);

// torneioRoutes.patch('/abreFechaInscricoes', informativo, verificaJWT, abreFechaInscricoesController.handle);
// torneioRoutes.patch('/finalizarCampeonato', informativo, verificaJWT, finalizaCampeonato.handle);
// torneioRoutes.patch('/reabrirCampeonato', informativo, verificaJWT, reabrirCampeonato.handle);

// torneioRoutes.get('/proximosCampeonatos', informativo, listaProximosCampeonatoController.handle);


export { torneioRoutes };
