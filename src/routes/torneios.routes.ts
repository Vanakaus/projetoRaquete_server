import { Router } from "express";
import { informativo } from "../middlewares";
import { AtualizarTorneioController, CriarTorneioController, FinalizaTorneioController, GerarPontuacaoController, LerTorneioController, ListarResultadoController, ListarStatusController, ListarTorneiosAcademiaController } from "../controllers/campeonatos/controller";
import { verificaJWT } from "../middlewares/verificaJWT";



const torneioRoutes = Router();

const criarTorneioController  = new CriarTorneioController();
const listarTorneiosAcademiaController = new ListarTorneiosAcademiaController();
const listarStatusController = new ListarStatusController();
const lerTorneioController = new LerTorneioController();
const atualizarTorneioController = new AtualizarTorneioController();
const gerarPontuacaoController = new GerarPontuacaoController();
const finalizaTorneio = new FinalizaTorneioController();
const listarResultadoTorneio = new ListarResultadoController();

// const leCampeonatoController = new LeCampeonatoController();
// const leCampeonatoCriadoController = new LeCampeonatoCriadoController();
// const listaCampeonatosCriadosController = new ListaCampeonatosCriadosController();
// const abreFechaInscricoesController = new AbreFechaInscricoesController();
// const reabrirCampeonato = new ReabrirCampeonatoController();
// const listaProximosCampeonatoController = new ListaProximosCampeonatosController();



torneioRoutes.post('/criar', informativo, verificaJWT, criarTorneioController.handle);
torneioRoutes.patch('/atualizarTorneio', informativo, verificaJWT, atualizarTorneioController.handle);

torneioRoutes.get('/ler', informativo, verificaJWT, lerTorneioController.handle);
torneioRoutes.get('/listarStatus', informativo, listarStatusController.handle);
torneioRoutes.get('/listarAcademia', informativo, verificaJWT, listarTorneiosAcademiaController.handle);
torneioRoutes.get('/listarResultado', informativo, listarResultadoTorneio.handle);

torneioRoutes.get('/gerarResultados', informativo, verificaJWT, gerarPontuacaoController.handle);
torneioRoutes.post('/finalizarTorneio', informativo, verificaJWT, finalizaTorneio.handle);



// torneioRoutes.get('/listaCampeonatosCriados', informativo, verificaJWT, listaCampeonatosCriadosController.handle);
// torneioRoutes.get('/leCampeonato', informativo, leCampeonatoController.handle);
// torneioRoutes.get('/leCampeonatoCriado', informativo, verificaJWT, leCampeonatoCriadoController.handle);

// torneioRoutes.patch('/abreFechaInscricoes', informativo, verificaJWT, abreFechaInscricoesController.handle);
// torneioRoutes.patch('/reabrirCampeonato', informativo, verificaJWT, reabrirCampeonato.handle);

// torneioRoutes.get('/proximosCampeonatos', informativo, listaProximosCampeonatoController.handle);


export { torneioRoutes };
