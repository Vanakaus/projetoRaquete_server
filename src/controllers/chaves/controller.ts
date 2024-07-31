import { Request, Response } from "express";
import { GerarChaveUseCase } from "./gerarChave";
import { LimparChaveUseCase } from "./limparChave";
import { ListarChavesUseCase } from "./listarChaves";
import { AtualizarPlacarUseCase } from "./atualizarPlacar";
import { AtualizarPlacarDTO } from "../../interface/ChavesDTO";

const jwt = require('jsonwebtoken');



export class GerarChaveController {
    async handle(req: Request, res: Response) {
        
        var cpf = '';
        const { id_jogador } = req.query as any;
        const { id_campeonato } = req.query as any;
        const token = req.headers['x-access-token']

        jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: { cpf: string; }) => {
            cpf = decoded.cpf;
        });


        const gerarChaveUseCase = new GerarChaveUseCase();
        
        const result = await gerarChaveUseCase.execute({ cpf, id_jogador, id_campeonato }) as any;
        result.status= "success";
        result.mensagem = "Chaves geradas com sucesso";

        return res.status(201).json(result);
    }
}



export class LimparChaveController {
    async handle(req: Request, res: Response) {
        
        var cpf = '';
        const { id_jogador } = req.query as any;
        const { id_campeonato } = req.query as any;
        const token = req.headers['x-access-token']

        jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: { cpf: string; }) => {
            cpf = decoded.cpf;
        });


        const limparChaveUseCase = new LimparChaveUseCase();
        
        const result = await limparChaveUseCase.execute({ cpf, id_jogador, id_campeonato }) as any;
        result.status= "success";
        result.mensagem = "Chaves deletadas com sucesso";

        return res.status(201).json(result);
    }
}


export class ListarChavesController {
    async handle(req: Request, res: Response) {
        
        const { id_campeonato } = req.query as any;

        const listarChavesUseCase = new ListarChavesUseCase();
        
        const result = await listarChavesUseCase.execute({ id_campeonato }) as any;
        result.status= "success";
        result.mensagem = "Chaves deletadas com sucesso";

        return res.status(201).json(result);
    }
}


export class AtualizarPlacarController {
    async handle(req: Request, res: Response) {
        
        let cpf = '';
        const { id, id_jogador, pontuacao1, pontuacao2, id_vencedor } = req.body;
        const token = req.headers['x-access-token']

        jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: { cpf: string; }) => {
            cpf = decoded.cpf;
        });


        const atualizarPlacarUseCase = new AtualizarPlacarUseCase();
        
        const result = await atualizarPlacarUseCase.execute({ cpf, id, id_jogador, pontuacao1, pontuacao2, id_vencedor }) as any;
        result.status= "success";
        result.mensagem = "Placar atualizado com sucesso";

        return res.status(201).json(result);
    }
}

