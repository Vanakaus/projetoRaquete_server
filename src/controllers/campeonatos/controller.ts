import { Request, Response } from "express";
import { CreateCampeonatoUseCase } from "./createCampeonato";
import { ListaCampeonatosUseCase } from "./listaCampeonatos";
import { LeCampeonatoUseCase } from "./leCampeonato";
import { ListaCampeonatosCriadosUseCase } from "./listaCampeonatosCriados";
import { LeCampeonatoCriadoUseCase } from "./leCampeonatoCriado";
import { AtualizaCampeonatoUseCase } from "./atualizaCampeonato";

const jwt = require('jsonwebtoken');



export class AtualizaCampeonatoController {
    async handle(req: Request, res: Response) {
        
        var cpfToken = '';
        const { id_criador, id, nome, descricao, regras, classe, numJogadores, premiacao, sets, local, dataInicio, dataFim } = req.body;
        const token = req.headers['x-access-token']

        jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: { cpf: string; }) => {
            cpfToken = decoded.cpf;
        });


        const createCampeonatoUseCase = new AtualizaCampeonatoUseCase();
        
        const result = await createCampeonatoUseCase.execute({ cpfToken, id, id_criador, nome, descricao, regras, classe, numJogadores, premiacao, sets, local, dataInicio, dataFim}) as any;
        result.status= "success";
        result.mensagem = "Campeonato atualizado com sucesso";

        return res.status(201).json(result);
    }
}



export class CreateCampeonatoController {
    async handle(req: Request, res: Response) {
        
        var cpfToken = '';
        const { cpf, nome, descricao, regras, classe, numJogadores, premiacao, sets, local, dataInscricao, dataInicio, dataFim } = req.body;
        const token = req.headers['x-access-token']

        jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: { cpf: string; }) => {
            cpfToken = decoded.cpf;
        });


        const createCampeonatoUseCase = new CreateCampeonatoUseCase();
        
        const result = await createCampeonatoUseCase.execute({ cpfToken, cpf, nome, descricao, regras, classe, numJogadores, premiacao, sets, local,dataInscricao, dataInicio, dataFim}) as any;
        result.status= "success";
        result.mensagem = "Campeonato criado com sucesso";

        return res.status(201).json(result);
    }
}


export class ListaCampeonatosController {
    async handle(req: Request, res: Response) {
        
        const { cpf } = req.query;
        const listCampeonatosUseCase = new ListaCampeonatosUseCase();
        
        const result = await listCampeonatosUseCase.execute({cpf: cpf?.toString() ?? ''});
        return res.status(201).json(result);
    }
}


export class ListaCampeonatosCriadosController {
    async handle(req: Request, res: Response) {
        
        var cpfToken = '';
        const { cpf } = req.query;
        const token = req.headers['x-access-token']


        jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: { cpf: string; }) => {
            cpfToken = decoded.cpf;
        });

        const listaCampeonatosCriadosUseCase = new ListaCampeonatosCriadosUseCase();
        
        const result = await listaCampeonatosCriadosUseCase.execute({cpf: cpfToken, id_criador: cpf?.toString() ?? ''});
        return res.status(201).json(result);
    }
}


export class LeCampeonatoController {
    async handle(req: Request, res: Response) {
        
        const { id, cpf } = req.query;
        const leCampeonatoUseCase = new LeCampeonatoUseCase();
        
        const result = await leCampeonatoUseCase.execute({id: id?.toString() ?? '', cpf: cpf?.toString() ?? ''});
        return res.status(201).json(result);
    }
}


export class LeCampeonatoCriadoController {
    async handle(req: Request, res: Response) {
        
        var cpf = '';
        const token = req.headers['x-access-token']
        const { id, id_criador } = req.query;
        
        jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: { cpf: string; }) => {
            cpf = decoded.cpf;
        });

        const leCampeonatoCriadoUseCase = new LeCampeonatoCriadoUseCase();
        
        const result = await leCampeonatoCriadoUseCase.execute({id: id?.toString() ?? '', cpf, id_criador: id_criador?.toString() ?? ''});
        return res.status(201).json(result);
    }
}
