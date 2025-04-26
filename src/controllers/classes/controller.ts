import { Request, Response } from "express";
import { CriarClasseUseCase } from "./criarClasse";
import { ListarClassesUseCase } from "./listarClasses";
import { AtualizarClasseUseCase } from "./atualizarClasse";
import { AdicionarClasseRankingUseCase } from "./adicionarClasseRanking";
import { ContarJogadoresClasseUseCase } from "./contarJogadoresClasse";

const jwt = require('jsonwebtoken');



export class ListarClassesController {
    async handle(req: Request, res: Response) {
        
        const listarClassesUseCase = new ListarClassesUseCase();
        
        const token = req.headers['x-access-token']

        var id_academia = '';
        jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: { login: string, id_academia: string }) => {
            id_academia = decoded.id_academia;
        });

        const result = await listarClassesUseCase.execute({ id_academia }) as any;
        result.status= "success";
        result.mensagem = "Classes listadas com sucesso";
        
        return res.status(201).json(result);
    }
}



export class CriarClasseController {
    async handle(req: Request, res: Response) {
        
        const criaClasseUseCase = new CriarClasseUseCase();

        const { sigla, nome, masculino, misto, dupla, id_ranking } = req.body;
        const token = req.headers['x-access-token']
        
        var id_academia = '';
        jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: { login: string, id_academia: string }) => {
            id_academia = decoded.id_academia;
        });

        const result = await criaClasseUseCase.execute({ id_academia, id_ranking, sigla, nome, masculino, misto, dupla }) as any;
        result.status= "success";
        result.mensagem = "Classe cadastrada com sucesso";

        return res.status(201).json(result);
    }
}



export class AtualizarClasseController {
    async handle(req: Request, res: Response) {
        
        const atualizarClasseUseCase = new AtualizarClasseUseCase();

        const { id, sigla, nome, masculino, misto, dupla } = req.body;
        const token = req.headers['x-access-token']
        
        var id_academia = '';
        jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: { login: string, id_academia: string }) => {
            id_academia = decoded.id_academia;
        });

        const result = await atualizarClasseUseCase.execute({ id_academia, id, sigla, nome, masculino, misto, dupla }) as any;
        result.status= "success";
        result.mensagem = "Classe atualizada com sucesso";

        return res.status(201).json(result);
    }
}



export class AdicionarClasseRankingController {
    async handle(req: Request, res: Response) {
        
        const atualizarClasseUseCase = new AdicionarClasseRankingUseCase();

        const { idClasse, idRanking } = req.body;
        const token = req.headers['x-access-token']
        
        var id_academia = '';
        jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: { login: string, id_academia: string }) => {
            id_academia = decoded.id_academia;
        });

        const result = await atualizarClasseUseCase.execute({ id_academia, idClasse, idRanking }) as any;
        result.status= "success";
        result.mensagem = "Classe adicionada ao ranking com sucesso";

        return res.status(201).json(result);
    }
}



export class ContarJogadoresClasseController {
    async handle(req: Request, res: Response) {
        
        const contarJogadoresClasseUseCase = new ContarJogadoresClasseUseCase();

        const token = req.headers['x-access-token']
        
        var id_academia = '';
        jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: { login: string, id_academia: string }) => {
            id_academia = decoded.id_academia;
        });

        const result = await contarJogadoresClasseUseCase.execute({ id_academia });
        result.status= "success";
        result.mensagem = "Classe adicionada ao ranking com sucesso";

        return res.status(201).json(result);
    }
}