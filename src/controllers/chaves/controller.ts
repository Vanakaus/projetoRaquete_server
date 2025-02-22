import { Request, Response } from "express";
import { GerarChaveUseCase } from "./gerarChave";
import { LimparChaveUseCase } from "./limparChave";
import { ListarPartidasUseCase } from "./listarPartidas";
import { AtualizarPlacarUseCase } from "./atualizarPlacar";
import { AtualizardadosUseCase } from "./atualizarDados";
import { ListaProximasPartidasUseCase } from "./listaProximasPartidas";

const jwt = require('jsonwebtoken');



export class GerarChaveController {
    async handle(req: Request, res: Response) {
        
        const { idTorneio, idClasseTorneio, numCabecas } = req.body;

        const gerarChaveUseCase = new GerarChaveUseCase();
        
        const result = await gerarChaveUseCase.execute({ idTorneio, idClasseTorneio, numCabecas }) as any;
        result.status= "success";
        result.mensagem = "Jogos gerados com sucesso";

        return res.status(201).json(result);
    }
}



export class LimparChaveController {
    async handle(req: Request, res: Response) {
        
        const { idTorneio, id_ClasseTorneio } = req.body;

        const limparChaveUseCase = new LimparChaveUseCase();
        
        const result = await limparChaveUseCase.execute({ idTorneio, id_ClasseTorneio }) as any;
        result.status= "success";
        result.mensagem = "Jogos deletados com sucesso";

        return res.status(201).json(result);
    }
}



export class ListarChavesController {
    async handle(req: Request, res: Response) {
        
        const { idTorneio } = req.query as any;

        const listarPartidasUseCase = new ListarPartidasUseCase();
        
        const result = await listarPartidasUseCase.execute({ idTorneio }) as any;
        result.status= "success";
        result.mensagem = "Partidas listadas com sucesso";

        return res.status(201).json(result);
    }
}



export class AtualizarDadosController {
    async handle(req: Request, res: Response) {
        
        const { novosDados } = req.body;
        

        const atualizarDadosUseCase = new AtualizardadosUseCase();
        
        const result = await atualizarDadosUseCase.execute({ novosDados }) as any;

        if(result.partidasNaoAtualizadas.length > 0){
            result.status= "error";

            if(result.partidasAtualizadas.length > 0)
                result.mensagem = "Algumas partidas não foram atualizadas";
            else
                result.mensagem = "Nenhuma partida foi atualizada";
            return res.status(400).json(result);
        } else {
            result.status= "success";
            result.mensagem = "Dados atualizados com sucesso";
            return res.status(201).json(result);
        }
    }
}



export class AtualizarPlacarController {
    async handle(req: Request, res: Response) {
        
        const { novosPlacares } = req.body;

        const atualizarPlacarUseCase = new AtualizarPlacarUseCase();
        
        const result = await atualizarPlacarUseCase.execute({ novosPlacares }) as any;
        result.status= "success";

        if(result.partidasNaoAtualizadas.length){
            
            if(result.partidasAtualizadas.length)
                result.mensagem = "Algumas partidas não foram atualizadas";
            else if(result.partidasNaoAtualizadas.length > 1)
                result.mensagem = "Não foi possivel atualizar os placares";
            else
                result.mensagem = "Não foi possivel atualizar o placar";
            return res.status(400).json(result);

        }else if(result.partidasAtualizadas.length > 1)
            result.mensagem = "Placares atualizados com sucesso";
        else
            result.mensagem = "Placar atualizado com sucesso";
        
        return res.status(201).json(result);
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

