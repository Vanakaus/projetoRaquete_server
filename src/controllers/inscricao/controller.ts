import { Request, Response } from "express";
import { ListarInscricoesUseCase } from "./listarInscricoes";
import { ListaInscricoesCampeonatoUseCase } from "./listaInscricoesCampeonato";
import { AdicionarInscricoesUseCase } from "./adicionarInscricoes";

const jwt = require('jsonwebtoken');



export class AdicionarInscricoesController {
    async handle(req: Request, res: Response) {
        
        const adicionarInscricoesUseCase = new AdicionarInscricoesUseCase();

        const { id_torneio, inscricaoClasse } = req.body as any;
        const token = req.headers['x-access-token']
        
        var id_academia = '';
        jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: { login: string, id_academia: string }) => {
            id_academia = decoded.id_academia;
        });


        
        const result = await adicionarInscricoesUseCase.execute({ id_academia, id_torneio, inscricaoClasse }) as any;
        result.status= "success";
        result.mensagem = result.sucesso ?
                            result.falha ? "Inscrição realizada com falhas"
                                : "Inscrição realizada com sucesso"
                        : "Inscrição não realizada";

        return res.status(201).json(result);
    }
}


export class ListarInscricoesController {
    async handle(req: Request, res: Response) {

        const listarInscricoesUseCase = new ListarInscricoesUseCase();
        
        const { idTorneio } = req.query as any;
        
        const result = await listarInscricoesUseCase.execute({ idTorneio }) as any;
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
