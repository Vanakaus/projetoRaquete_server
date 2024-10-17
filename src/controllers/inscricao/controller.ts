import { Request, Response } from "express";
import { CriaInscricaoUseCase } from "./criaInscricao";
import { ListaInscricoesUseCase } from "./listaInscricoes";
import { ListaInscricoesCampeonatoUseCase } from "./listaInscricoesCampeonato";

const jwt = require('jsonwebtoken');



export class CriaInscricaoController {
    async handle(req: Request, res: Response) {
        
        var cpf = '';
        const { id_campeonato, id_jogador } = req.body;
        const token = req.headers['x-access-token']

        jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: { cpf: string; }) => {
            cpf = decoded.cpf;
        });


        const criaInscricaoUseCase = new CriaInscricaoUseCase();
        
        const result = await criaInscricaoUseCase.execute({ cpf, id_campeonato, id_jogador }) as any;
        result.status= "success";
        result.mensagem = "Inscrição realizada com sucesso";

        return res.status(201).json(result);
    }
}


export class ListaInscricoesController {
    async handle(req: Request, res: Response) {
        
        var cpf = '';
        const { id_jogador } = req.query as any;
        const token = req.headers['x-access-token']

        jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: { cpf: string; }) => {
            cpf = decoded.cpf;
        });


        const listaInscricoesUseCase = new ListaInscricoesUseCase();
        
        const result = await listaInscricoesUseCase.execute({ cpf, id_jogador }) as any;
        result.status= "success";
        result.mensagem = "Inscrições listadas com sucesso";

        return res.status(201).json(result);
    }
}


export class ListaInscricoesCampeonatoController {
    async handle(req: Request, res: Response) {
        
        var cpf = '';
        const { id_jogador } = req.query as any;
        const { id_campeonato } = req.query as any;
        const token = req.headers['x-access-token']

        jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: { cpf: string; }) => {
            cpf = decoded.cpf;
        });


        const listaInscricoesCampeonatoUseCase = new ListaInscricoesCampeonatoUseCase();
        
        const result = await listaInscricoesCampeonatoUseCase.execute({ cpf, id_jogador, id_campeonato }) as any;

        return res.status(201).json(result);
    }
}
