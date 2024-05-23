import { Request, Response } from "express";
import { CreateInscricaoUseCase } from "./createInscricao";
import { ListaInscricoesUseCase } from "./listaInscricoes";

const jwt = require('jsonwebtoken');



export class CreateInscricaoController {
    async handle(req: Request, res: Response) {
        
        var cpf = '';
        const { id_campeonato, id_jogador } = req.body;
        const token = req.headers['x-access-token']

        jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: { cpf: string; }) => {
            cpf = decoded.cpf;
        });


        const createInscricaoUseCase = new CreateInscricaoUseCase();
        
        const result = await createInscricaoUseCase.execute({ cpf, id_campeonato, id_jogador }) as any;
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
