import { Request, Response } from "express";
import { GerarChaveUseCase } from "./gerarChave";
import { LimparChaveUseCase } from "./limparChave";
import { ListarChavesUseCase } from "./listarChaves";
import { AtualizarPlacarUseCase } from "./atualizarPlacar";
import { AtualizardatasUseCase } from "./atualizarDatas";
import { ListaProximasPartidasUseCase } from "./listaProximasPartidas";

const jwt = require('jsonwebtoken');



export class GerarChaveController {
    async handle(req: Request, res: Response) {
        
        var cpf = '';
        const { id_jogador, id_campeonato } = req.query as any;
        const token = req.headers['x-access-token']

        jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: { cpf: string; }) => {
            cpf = decoded.cpf;
        });


        const gerarChaveUseCase = new GerarChaveUseCase();
        
        const result = await gerarChaveUseCase.execute({ cpf, id_jogador, id_campeonato }) as any;
        result.status= "success";
        result.mensagem = "Jogos gerados com sucesso";

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
        result.mensagem = "Jogos deletados com sucesso";

        return res.status(201).json(result);
    }
}


export class ListarChavesController {
    async handle(req: Request, res: Response) {
        
        const { id_campeonato } = req.query as any;

        const listarChavesUseCase = new ListarChavesUseCase();
        
        const result = await listarChavesUseCase.execute({ id_campeonato }) as any;
        result.status= "success";
        result.mensagem = "Jogos deletados com sucesso";

        return res.status(201).json(result);
    }
}


export class AtualizarPlacarController {
    async handle(req: Request, res: Response) {
        
        let cpf = '';
        const { id, id_jogador, novoPS1, novoPS2, novoPT1, novoPT2, id_vencedor } = req.body;
        const token = req.headers['x-access-token']

        jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: { cpf: string; }) => {
            cpf = decoded.cpf;
        });


        const atualizarPlacarUseCase = new AtualizarPlacarUseCase();
        
        const result = await atualizarPlacarUseCase.execute({ cpf, id, id_jogador, novoPS1, novoPS2, novoPT1, novoPT2, id_vencedor }) as any;
        result.status= "success";
        result.mensagem = "Placar atualizado com sucesso";

        return res.status(201).json(result);
    }
}


export class AtualizarDatasController {
    async handle(req: Request, res: Response) {
        
        let cpf = '';
        const { id_jogador, id_campeonato, novasDatas } = req.body;
        const token = req.headers['x-access-token']

        jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: { cpf: string; }) => {
            cpf = decoded.cpf;
        });


        const atualizarDatasUseCase = new AtualizardatasUseCase();
        
        const result = await atualizarDatasUseCase.execute({ cpf, id_jogador, id_campeonato, novasDatas }) as any;

        
        if(result.partidasNaoAtualizadas.length > 0){
            result.status= "error";

            if(result.partidasAtualizadas.length > 0)
                result.mensagem = "Algumas partidas não foram encontradas";
            else
                result.mensagem = "Nenhuma partida foi encontrada";
            return res.status(400).json(result);
        } else {
            result.status= "success";
            result.mensagem = "Datas atualizadas com sucesso";
            return res.status(201).json(result);
        }
    }
}




export class ListarProximasPartidasController {
    async handle(req: Request, res: Response) {
        
        const { id_jogador } = req.query as any;

        const listarProximasPartidasUseCase = new ListaProximasPartidasUseCase();
        
        const result = await listarProximasPartidasUseCase.execute( id_jogador ) as any;
        result.status= "success";
        result.mensagem = "Partidas listadas com sucesso";

        return res.status(201).json(result);
    }
}

