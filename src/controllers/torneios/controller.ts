import { Request, Response } from "express";

import { CriaCampeonatoUseCase } from "./criarTorneio";
import { ListarTorneiosAcademiaUseCase } from "./listarTorneiosAcademia";
import { LerTorneioUseCase } from "./leTorneio";
import { ListaCampeonatosCriadosUseCase } from "./listaCampeonatosCriados";
import { LeCampeonatoCriadoUseCase } from "./leCampeonatoCriado";
import { AtualizarTorneioUseCase } from "./atualizarTorneio";
import { AbreFechaInscricoesUseCase } from "./abrirIscricoes.ts";
import { FinalizarTorneioUseCase } from "./finalizarTorneio";
import { ReabrirCampeonatoUseCase } from "./reabrirCampeonato";
import { ListaProximosCampeonatosUseCase } from "./listaProximosCampeonatos";
import { ListarStatusUseCase } from "./listarStatus";
import { GerarPontuacaoUseCase } from "./gerarPontuacao";
import { ListarResultadoUseCase } from "./listarResultado";

const jwt = require('jsonwebtoken');




export class ListarStatusController {
    async handle(req: Request, res: Response) {
        
        const listarStatusUseCase = new ListarStatusUseCase();

        const result = await listarStatusUseCase.execute();

        result.status= "success";
        result.mensagem = "Status listados com sucesso";
        
        return res.status(201).json(result);
    }
}



export class CriarTorneioController {
    async handle(req: Request, res: Response) {
        
        const { id_ranking, nome, descricao, local, sets, modalidade, pontuacao, classes, dataInicio, dataFim } = req.body;
        const token = req.headers['x-access-token']

        var id_academia = '';
        jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: { login: string, id_academia: string }) => {
            id_academia = decoded.id_academia;
        });

        const criaCampeonatoUseCase = new CriaCampeonatoUseCase();
        
        const result = await criaCampeonatoUseCase.execute({ id_academia, id_ranking, nome, descricao, local, sets, modalidade, pontuacao, classes, dataInicio, dataFim}) as any;
        result.status= "success";
        result.mensagem = "Campeonato criado com sucesso";

        return res.status(201).json(result);
    }
}



export class ListarTorneiosAcademiaController {
    async handle(req: Request, res: Response) {
        
        const listarTorneiosUseCase = new ListarTorneiosAcademiaUseCase();

        const token = req.headers['x-access-token']

        var id_academia = '';
        jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: { login: string, id_academia: string }) => {
            id_academia = decoded.id_academia;
        });

        const result = await listarTorneiosUseCase.execute({ id_academia });

        result.status= "success";
        result.mensagem = "Torneios listados com sucesso";
        
        return res.status(201).json(result);
    }
}



export class LerTorneioController {
    async handle(req: Request, res: Response) {
        
        const lerTorneioUseCase = new LerTorneioUseCase();

        const { id } = req.query;

        if (typeof id !== 'string') {
            return res.status(400).json({ status: "error", mensagem: "Id inválido" });
        }

        const result = await lerTorneioUseCase.execute({ id });

        result.status= "success";
        result.mensagem = "Torneio lido com sucesso";
        
        return res.status(201).json(result);
    }
}



export class AtualizarTorneioController {
    async handle(req: Request, res: Response) {
        
        const atualizarTorneioUseCase = new AtualizarTorneioUseCase();

        const { id, nome, descricao, local, sets, modalidade, pontuacao, classesDeleta, classesAdiciona, dataInicio, dataFim } = req.body;
        const token = req.headers['x-access-token']

        var id_academia = '';
        jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: { login: string, id_academia: string }) => {
            id_academia = decoded.id_academia;
        });
        
        const result = await atualizarTorneioUseCase.execute({ id, id_academia, nome, descricao, local, sets, modalidade, pontuacao, classesDeleta, classesAdiciona, dataInicio, dataFim }) as any;
        result.status= "success";
        result.mensagem = "Campeonato atualizado com sucesso";

        return res.status(201).json(result);
    }
}



export class GerarPontuacaoController {
    async handle(req: Request, res: Response) {
        
        const gerarPontuacaoUseCase = new GerarPontuacaoUseCase();

        const { id_torneio } = req.query;

        if (typeof id_torneio !== 'string') {
            return res.status(400).json({ status: "error", mensagem: "Id_torneio inválido" });
        }
        
        const result = await gerarPontuacaoUseCase.execute({ id_torneio }) as any;
        result.status= "success";
        result.mensagem = "Listagem de pontuação gerada com sucesso";

        return res.status(201).json(result);
    }
}



export class FinalizaTorneioController {
    async handle(req: Request, res: Response) {
        
        const { id_torneio, resultados } = req.body;
        
        const FinalizarUseCase = new FinalizarTorneioUseCase();
        
        const result = await FinalizarUseCase.execute({ id_torneio, resultados });
        result.status= "success";
        result.mensagem = 'Torneio finalizado com sucesso';

        return res.status(201).json(result);
    }
}



export class ListarResultadoController {
    async handle(req: Request, res: Response) {
        
        const { id_torneio } = req.query;
        
        const FinalizarUseCase = new ListarResultadoUseCase();
        
        if (typeof id_torneio !== 'string') {
            return res.status(400).json({ status: "error", mensagem: "IdTorneio inválido" });
        }
        const result = await FinalizarUseCase.execute({ id_torneio });
        result.status= "success";
        result.mensagem = 'Resultado listado com sucesso';

        return res.status(201).json(result);
    }
}







// export class ListaCampeonatosCriadosController {
//     async handle(req: Request, res: Response) {
        
//         var cpfToken = '';
//         const { cpf } = req.query;
//         const token = req.headers['x-access-token']


//         jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: { cpf: string; }) => {
//             cpfToken = decoded.cpf;
//         });

//         const listaCampeonatosCriadosUseCase = new ListaCampeonatosCriadosUseCase();
        
//         const result = await listaCampeonatosCriadosUseCase.execute({cpf: cpfToken, id_criador: cpf?.toString() ?? ''});
//         return res.status(201).json(result);
//     }
// }


// export class LeCampeonatoController {
//     async handle(req: Request, res: Response) {
        
//         const { id, cpf } = req.query;
//         const leCampeonatoUseCase = new LeCampeonatoUseCase();
        
//         const result = await leCampeonatoUseCase.execute({id: id?.toString() ?? '', cpf: cpf?.toString() ?? ''});
//         return res.status(201).json(result);
//     }
// }


// export class LeCampeonatoCriadoController {
//     async handle(req: Request, res: Response) {
        
//         var cpf = '';
//         const token = req.headers['x-access-token']
//         const { id, id_criador } = req.query;
        
//         jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: { cpf: string; }) => {
//             cpf = decoded.cpf;
//         });

//         const leCampeonatoCriadoUseCase = new LeCampeonatoCriadoUseCase();
        
//         const result = await leCampeonatoCriadoUseCase.execute({id: id?.toString() ?? '', cpf, id_criador: id_criador?.toString() ?? ''});
//         return res.status(201).json(result);
//     }
// }



// export class AbreFechaInscricoesController {
//     async handle(req: Request, res: Response) {
        
//         var cpf = '';
//         const token = req.headers['x-access-token']
//         const { id, id_criador, abreFecha } = req.body;
        
//         jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: { cpf: string; }) => {
//             cpf = decoded.cpf;
//         });

//         const AbrirFecharUseCase = new AbreFechaInscricoesUseCase();
        
//         const result = await AbrirFecharUseCase.execute({id, cpf, id_criador, abreFecha});
//         result.status= "success";
//         result.mensagem = `Inscrições ${abreFecha ? 'abertas' : 'fechadas'} com sucesso`;

//         return res.status(201).json(result);
//     }
// }




// export class ReabrirCampeonatoController {
//     async handle(req: Request, res: Response) {
        
//         var cpf = '';
//         const token = req.headers['x-access-token']
//         const { id, id_criador } = req.body;
        
//         jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: { cpf: string; }) => {
//             cpf = decoded.cpf;
//         });

//         const reabrirCampeonatoUseCase = new ReabrirCampeonatoUseCase();
        
//         const result = await reabrirCampeonatoUseCase.execute({id, cpf, id_criador});
//         result.status= "success";
//         result.mensagem = "Campeonato reaberto com sucesso";

//         return res.status(201).json(result);
//     }
// }





// export class ListaProximosCampeonatosController {
//     async handle(req: Request, res: Response) {
        
//         const { id_jogador } = req.query as any;
        
//         const listaProximosCampeonatosUseCase = new ListaProximosCampeonatosUseCase();
        
//         const result = await listaProximosCampeonatosUseCase.execute(id_jogador) as any;
//         result.status= "success";
//         result.mensagem = "Campeonatos listados com sucesso";

//         return res.status(201).json(result);
//     }
// }
