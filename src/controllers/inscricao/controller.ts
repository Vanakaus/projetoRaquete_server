import { Request, Response } from "express";
import { CreateInscricaoUseCase } from "./createInscricao";




export class CreateInscricaoController {
    async handle(req: Request, res: Response) {
        
        const { id_campeonato, id_jogador } = req.body;
        const createInscricaoUseCase = new CreateInscricaoUseCase();
        
        const result = await createInscricaoUseCase.execute({ id_campeonato, id_jogador }) as any;
        result.status= "success";
        result.mensagem = "Inscrição realizada com sucesso";

        return res.status(201).json(result);
    }
}
