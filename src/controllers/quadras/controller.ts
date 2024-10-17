import { Request, Response } from "express";
import { CriaQuadraUseCase } from "./criaQuadra";
import { ListaQuadrasUseCase } from "./listaQuadra";
import { AtualizaQuadraUseCase } from "./atualizaQuadra";
import { DeletaQuadraUseCase } from "./deletaQuadra";

const jwt = require('jsonwebtoken');



export class CriaQuadraController {
    async handle(req: Request, res: Response) {
        
        var cpf = '';
        const { id_campeonato, id_jogador, quadra } = req.body;
        const token = req.headers['x-access-token']

        jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: { cpf: string; }) => {
            cpf = decoded.cpf;
        });

        const criaQuadraUseCase = new CriaQuadraUseCase();
        
        const result = await criaQuadraUseCase.execute({ cpf, id_jogador, id_campeonato, quadra }) as any;
        result.status= "success";
        result.mensagem = "Quadra adicionada com sucesso";

        return res.status(201).json(result);
    }
}


export class ListaQuadrasController {
    async handle(req: Request, res: Response) {
        
        var cpf = '';
        const { id_jogador, id_campeonato } = req.query as any;
        const token = req.headers['x-access-token']

        jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: { cpf: string; }) => {
            cpf = decoded.cpf;
        });


        const listaInscricoesUseCase = new ListaQuadrasUseCase();
        
        const result = await listaInscricoesUseCase.execute({ cpf, id_jogador, id_campeonato }) as any;
        result.status= "success";
        result.mensagem = "quacras listadas com sucesso";

        return res.status(201).json(result);
    }
}


export class AtualizaQuadraController {
    async handle(req: Request, res: Response) {
        
        var cpf = '';
        const { id_jogador, id_campeonato, id, quadra } = req.body as any;
        const token = req.headers['x-access-token']

        jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: { cpf: string; }) => {
            cpf = decoded.cpf;
        });


        const atualizaQuadraUseCase = new AtualizaQuadraUseCase();
        
        const result = await atualizaQuadraUseCase.execute({ cpf, id_jogador, id, id_campeonato, quadra }) as any;
        result.status= "success";
        result.mensagem = "Quadra atualizada com sucesso";

        return res.status(201).json(result);
    }
}


export class DeletaQuadraController {
    async handle(req: Request, res: Response) {
        
        var cpf = '';
        const { id_jogador, id_campeonato, id } = req.body as any;
        const token = req.headers['x-access-token']

        jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: { cpf: string; }) => {
            cpf = decoded.cpf;
        });


        const deletaQuadraUseCase = new DeletaQuadraUseCase();
        
        const result = await deletaQuadraUseCase.execute({ cpf, id_jogador, id, id_campeonato }) as any;
        result.status= "success";
        result.mensagem = "Horário apagado com sucesso";

        return res.status(201).json(result);
    }
}
