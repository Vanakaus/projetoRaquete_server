import { Router } from "express";
import { informativo } from "../middlewares";
import { CriarTorneioController, ListarStatusController, ListarTorneiosAcademiaController } from "../controllers/campeonatos/controller";
import { verificaJWT } from "../middlewares/verificaJWT";



const torneioRoutes = Router();

const criarTorneioController  = new CriarTorneioController();
const listarTorneiosAcademiaController = new ListarTorneiosAcademiaController();
const listarStatusController = new ListarStatusController();

// const atualizaCampeonatoController = new AtualizaCampeonatoController();
// const leCampeonatoController = new LeCampeonatoController();
// const leCampeonatoCriadoController = new LeCampeonatoCriadoController();
// const listaCampeonatosCriadosController = new ListaCampeonatosCriadosController();
// const abreFechaInscricoesController = new AbreFechaInscricoesController();
// const finalizaCampeonato = new FinalizaCampeonatoController();
// const reabrirCampeonato = new ReabrirCampeonatoController();
// const listaProximosCampeonatoController = new ListaProximosCampeonatosController();



torneioRoutes.post('/criar', informativo, verificaJWT, criarTorneioController.handle);

torneioRoutes.get('/listarStatus', informativo, listarStatusController.handle);
torneioRoutes.get('/listarAcademia', informativo, listarTorneiosAcademiaController.handle);

// torneioRoutes.patch('/atualizaCampeonato', informativo, verificaJWT, atualizaCampeonatoController.handle);
// torneioRoutes.get('/listaCampeonatosCriados', informativo, verificaJWT, listaCampeonatosCriadosController.handle);
// torneioRoutes.get('/leCampeonato', informativo, leCampeonatoController.handle);
// torneioRoutes.get('/leCampeonatoCriado', informativo, verificaJWT, leCampeonatoCriadoController.handle);

// torneioRoutes.patch('/abreFechaInscricoes', informativo, verificaJWT, abreFechaInscricoesController.handle);
// torneioRoutes.patch('/finalizarCampeonato', informativo, verificaJWT, finalizaCampeonato.handle);
// torneioRoutes.patch('/reabrirCampeonato', informativo, verificaJWT, reabrirCampeonato.handle);

// torneioRoutes.get('/proximosCampeonatos', informativo, listaProximosCampeonatoController.handle);


export { torneioRoutes };
