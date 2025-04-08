import { Request, Response } from "express";
import { ListarRankingUseCase } from "./listarRanking";
import { CriarRankingUseCase } from "./criarRanking";
import { ListarRankingClassesUseCase } from "./listarRankingClasses";
import { RankingUseCase } from "./ranking";
import { AppError } from "../../errors/AppErrors";

const jwt = require('jsonwebtoken');



export class ListarRankingController {
    async handle(req: Request, res: Response) {
        
        const listarRankingUseCase = new ListarRankingUseCase();
        
        var id_academia = req.query.id_academia as string;

        if (id_academia == undefined) {

            const token = req.headers['x-access-token']

            jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: { login: string, id_academia: string }) => {
                id_academia = decoded.id_academia;
            });
        }


        if (!id_academia) {
            throw new AppError("ID da academia não informado", 400);
        }

        const result = await listarRankingUseCase.execute({ id_academia }) as any;
        result.status= "success";
        result.mensagem = "Ranking listado com sucesso";
        
        return res.status(201).json(result);
    }
}



export class ListarRankingClassesController {
    async handle(req: Request, res: Response) {
        
        const listarRankingClassesUseCase = new ListarRankingClassesUseCase();
        
        const id_ranking = Number(req.query.idRanking);

        const result = await listarRankingClassesUseCase.execute({ id_ranking }) as any;
        result.status= "success";
        result.mensagem = "Ranking listado com sucesso";
        
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



export class RankingController {
    async handle(req: Request, res: Response) {
        
        const rankingUseCase = new RankingUseCase();

        const id_classeRanking = Number(req.query.id_classeRanking);

        const result = await rankingUseCase.execute({ id_classeRanking }) as any;
        result.status= "success";
        result.mensagem = "Ranking listado com sucesso";

        return res.status(201).json(result);
    }
}

