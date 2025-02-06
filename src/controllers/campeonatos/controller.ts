import { Request, Response } from "express";
import { CriaCampeonatoUseCase } from "./criaCampeonato";
import { ListaCampeonatosUseCase } from "./listaCampeonatos";
import { LeCampeonatoUseCase } from "./leCampeonato";
import { ListaCampeonatosCriadosUseCase } from "./listaCampeonatosCriados";
import { LeCampeonatoCriadoUseCase } from "./leCampeonatoCriado";
import { AtualizaCampeonatoUseCase } from "./atualizaCampeonato";
import { AbreFechaInscricoesUseCase } from "./abrirIscricoes.ts";
import { FinalizarCampeonatoUseCase } from "./finalizarCampeonato";
import { ReabrirCampeonatoUseCase } from "./reabrirCampeonato";
import { ListaProximosCampeonatosUseCase } from "./listaProximosCampeonatos";

const jwt = require('jsonwebtoken');



export class AtualizaCampeonatoController {
    async handle(req: Request, res: Response) {
        
        var cpfToken = '';
        const { id_criador, id, nome, descricao, regras, classe, numJogadores, premiacao, sets, local, dataInicio, dataFim } = req.body;
        const token = req.headers['x-access-token']

        jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: { cpf: string; }) => {
            cpfToken = decoded.cpf;
        });


        const criaCampeonatoUseCase = new AtualizaCampeonatoUseCase();
        
        const result = await criaCampeonatoUseCase.execute({ cpfToken, id, id_criador, nome, descricao, regras, classe, numJogadores, premiacao, sets, local, dataInicio, dataFim}) as any;
        result.status= "success";
        result.mensagem = "Campeonato atualizado com sucesso";

        return res.status(201).json(result);
    }
}



export class CriarCampeonatoController {
    async handle(req: Request, res: Response) {
        
        const { idRanking, nome, descricao, local, sets, tiebreak, modalidade, pontuacao, classes, dataInicio, dataFim } = req.body;
        const token = req.headers['x-access-token']

        var id_academia = '';
        jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: { login: string, id_academia: string }) => {
            id_academia = decoded.id_academia;
        });

        const criaCampeonatoUseCase = new CriaCampeonatoUseCase();
        
        const result = await criaCampeonatoUseCase.execute({ id_academia, idRanking, nome, descricao, local, sets, tiebreak, modalidade, pontuacao, classes, dataInicio, dataFim}) as any;
        result.status= "success";
        result.mensagem = "Campeonato criado com sucesso";

        return res.status(201).json(result);
    }
}


export class ListaCampeonatosController {
    async handle(req: Request, res: Response) {
        
        const { cpf } = req.query;
        const listCampeonatosUseCase = new ListaCampeonatosUseCase();
        
        const result = await listCampeonatosUseCase.execute({cpf: cpf?.toString() ?? ''});

        result.status= "success";
        result.mensagem = "Campeonatos listados com sucesso";
        
        return res.status(201).json(result);
    }
}


export class ListaCampeonatosCriadosController {
    async handle(req: Request, res: Response) {
        
        var cpfToken = '';
        const { cpf } = req.query;
        const token = req.headers['x-access-token']


        jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: { cpf: string; }) => {
            cpfToken = decoded.cpf;
        });

        const listaCampeonatosCriadosUseCase = new ListaCampeonatosCriadosUseCase();
        
        const result = await listaCampeonatosCriadosUseCase.execute({cpf: cpfToken, id_criador: cpf?.toString() ?? ''});
        return res.status(201).json(result);
    }
}


export class LeCampeonatoController {
    async handle(req: Request, res: Response) {
        
        const { id, cpf } = req.query;
        const leCampeonatoUseCase = new LeCampeonatoUseCase();
        
        const result = await leCampeonatoUseCase.execute({id: id?.toString() ?? '', cpf: cpf?.toString() ?? ''});
        return res.status(201).json(result);
    }
}


export class LeCampeonatoCriadoController {
    async handle(req: Request, res: Response) {
        
        var cpf = '';
        const token = req.headers['x-access-token']
        const { id, id_criador } = req.query;
        
        jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: { cpf: string; }) => {
            cpf = decoded.cpf;
        });

        const leCampeonatoCriadoUseCase = new LeCampeonatoCriadoUseCase();
        
        const result = await leCampeonatoCriadoUseCase.execute({id: id?.toString() ?? '', cpf, id_criador: id_criador?.toString() ?? ''});
        return res.status(201).json(result);
    }
}



export class AbreFechaInscricoesController {
    async handle(req: Request, res: Response) {
        
        var cpf = '';
        const token = req.headers['x-access-token']
        const { id, id_criador, abreFecha } = req.body;
        
        jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: { cpf: string; }) => {
            cpf = decoded.cpf;
        });

        const AbrirFecharUseCase = new AbreFechaInscricoesUseCase();
        
        const result = await AbrirFecharUseCase.execute({id, cpf, id_criador, abreFecha});
        result.status= "success";
        result.mensagem = `Inscrições ${abreFecha ? 'abertas' : 'fechadas'} com sucesso`;

        return res.status(201).json(result);
    }
}



export class FinalizaCampeonatoController {
    async handle(req: Request, res: Response) {
        
        var cpf = '';
        const token = req.headers['x-access-token']
        const { id, id_criador, cancela } = req.body;
        
        jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: { cpf: string; }) => {
            cpf = decoded.cpf;
        });

        const FinalizarUseCase = new FinalizarCampeonatoUseCase();
        
        const result = await FinalizarUseCase.execute({id, cpf, id_criador, cancela});
        result.status= "success";
        result.mensagem = `Campeonato ${cancela ? 'cancelado' : 'finalizado'} com sucesso`;

        return res.status(201).json(result);
    }
}




export class ReabrirCampeonatoController {
    async handle(req: Request, res: Response) {
        
        var cpf = '';
        const token = req.headers['x-access-token']
        const { id, id_criador } = req.body;
        
        jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: { cpf: string; }) => {
            cpf = decoded.cpf;
        });

        const reabrirCampeonatoUseCase = new ReabrirCampeonatoUseCase();
        
        const result = await reabrirCampeonatoUseCase.execute({id, cpf, id_criador});
        result.status= "success";
        result.mensagem = "Campeonato reaberto com sucesso";

        return res.status(201).json(result);
    }
}





export class ListaProximosCampeonatosController {
    async handle(req: Request, res: Response) {
        
        const { id_jogador } = req.query as any;
        
        const listaProximosCampeonatosUseCase = new ListaProximosCampeonatosUseCase();
        
        const result = await listaProximosCampeonatosUseCase.execute(id_jogador) as any;
        result.status= "success";
        result.mensagem = "Campeonatos listados com sucesso";

        return res.status(201).json(result);
    }
}
