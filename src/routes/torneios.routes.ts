import { Router } from "express";
import { informativo } from "../middlewares";
import { AtualizarTorneioController, CriarTorneioController, FinalizaTorneioController, GerarPontuacaoController, LerTorneioController, ListarResultadoController, ListarStatusController, ListarTorneiosAcademiaController, ContarTorneiosStatusAcademiaController, ListaTorneiosPrincipaisController } from "../controllers/torneios/controller";
import { verificaJWT } from "../middlewares/verificaJWT";



const torneioRoutes = Router();

const criarTorneioController  = new CriarTorneioController();
const listarTorneiosAcademiaController = new ListarTorneiosAcademiaController();
const contarTorneiosStatusAcademiaController = new ContarTorneiosStatusAcademiaController();
const listarStatusController = new ListarStatusController();
const lerTorneioController = new LerTorneioController();
const atualizarTorneioController = new AtualizarTorneioController();
const gerarPontuacaoController = new GerarPontuacaoController();
const finalizaTorneio = new FinalizaTorneioController();
const listarResultadoTorneio = new ListarResultadoController();
const listaCampeonatoPrincipaisController = new ListaTorneiosPrincipaisController();



torneioRoutes.post('/criar', informativo, verificaJWT, criarTorneioController.handle);
torneioRoutes.patch('/atualizarTorneio', informativo, verificaJWT, atualizarTorneioController.handle);

torneioRoutes.get('/ler', informativo, lerTorneioController.handle);
torneioRoutes.get('/listar', informativo, verificaJWT, listarTorneiosAcademiaController.handle);
torneioRoutes.get('/listarPrincipais', informativo, verificaJWT, listaCampeonatoPrincipaisController.handle);
torneioRoutes.get('/contar', informativo, verificaJWT, contarTorneiosStatusAcademiaController.handle);
torneioRoutes.get('/listarStatus', informativo, listarStatusController.handle);
torneioRoutes.get('/listarResultado', informativo, listarResultadoTorneio.handle);

torneioRoutes.get('/gerarResultados', informativo, verificaJWT, gerarPontuacaoController.handle);
torneioRoutes.post('/finalizarTorneio', informativo, verificaJWT, finalizaTorneio.handle);



export { torneioRoutes };
