import { Request, Response } from "express";
import { ListarRankingUseCase } from "./listarRanking";
import { CriarRankingUseCase } from "./criarRanking";
import { ListarRankingClassesUseCase } from "./listarRankingClasses";

const jwt = require('jsonwebtoken');



export class ListarRankingController {
    async handle(req: Request, res: Response) {
        
        const listarRankingUseCase = new ListarRankingUseCase();
        
        const token = req.headers['x-access-token']

        var id_academia = '';
        jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: { login: string, id_academia: string }) => {
            id_academia = decoded.id_academia;
        });

        const result = await listarRankingUseCase.execute({ id_academia }) as any;
        return res.status(201).json(result);
    }
}



export class ListarRankingClassesController {
    async handle(req: Request, res: Response) {
        
        const listarRankingClassesUseCase = new ListarRankingClassesUseCase();
        
        const idRanking = Number(req.query.idRanking);

        const result = await listarRankingClassesUseCase.execute({ idRanking }) as any;
        return res.status(201).json(result);
    }
}



export class CriarRankingController {
    async handle(req: Request, res: Response) {
        
        const criaRankingUseCase = new CriarRankingUseCase();

        const { nome, classes } = req.body;
        const token = req.headers['x-access-token']
        
        var id_academia = '';
        jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: { login: string, id_academia: string }) => {
            id_academia = decoded.id_academia;
        });

        const result = await criaRankingUseCase.execute({ id_academia, nome, classes }) as any;
        result.status= "success";
        result.mensagem = "Ranking cadastrado com sucesso";

        return res.status(201).json(result);
    }
}

