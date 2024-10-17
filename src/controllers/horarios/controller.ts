import { Request, Response } from "express";
import { CriaHorarioUseCase } from "./criaHorario";
import { ListaHorariosUseCase } from "./listaHorarios";
import { AtualizaHorarioUseCase } from "./atualizaHorario";
import { DeletaHorarioUseCase } from "./deletaHorario";

const jwt = require('jsonwebtoken');



export class CriaHorarioController {
    async handle(req: Request, res: Response) {
        
        var cpf = '';
        const { id_campeonato, id_jogador, horario } = req.body;
        const token = req.headers['x-access-token']

        jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: { cpf: string; }) => {
            cpf = decoded.cpf;
        });

        const criaHorarioUseCase = new CriaHorarioUseCase();
        
        const result = await criaHorarioUseCase.execute({ cpf, id_jogador, id_campeonato, horario }) as any;
        result.status= "success";
        result.mensagem = "Horário adicionado com sucesso";

        return res.status(201).json(result);
    }
}


export class ListaHorariosController {
    async handle(req: Request, res: Response) {
        
        var cpf = '';
        const { id_jogador, id_campeonato } = req.query as any;
        const token = req.headers['x-access-token']

        jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: { cpf: string; }) => {
            cpf = decoded.cpf;
        });


        const listaInscricoesUseCase = new ListaHorariosUseCase();
        
        const result = await listaInscricoesUseCase.execute({ cpf, id_jogador, id_campeonato }) as any;
        result.status= "success";
        result.mensagem = "Inscrições listadas com sucesso";

        return res.status(201).json(result);
    }
}


export class AtualizaHorarioController {
    async handle(req: Request, res: Response) {
        
        var cpf = '';
        const { id_jogador, id_campeonato, id, horario } = req.body as any;
        const token = req.headers['x-access-token']

        jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: { cpf: string; }) => {
            cpf = decoded.cpf;
        });


        const atualizaHorarioUseCase = new AtualizaHorarioUseCase();
        
        const result = await atualizaHorarioUseCase.execute({ cpf, id_jogador, id, id_campeonato, horario }) as any;
        result.status= "success";
        result.mensagem = "Horário atualizado com sucesso";

        return res.status(201).json(result);
    }
}


export class DeletaHorarioController {
    async handle(req: Request, res: Response) {
        
        var cpf = '';
        const { id_jogador, id_campeonato, id } = req.body as any;
        const token = req.headers['x-access-token']

        jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: { cpf: string; }) => {
            cpf = decoded.cpf;
        });


        const deletaHorarioUseCase = new DeletaHorarioUseCase();
        
        const result = await deletaHorarioUseCase.execute({ cpf, id_jogador, id, id_campeonato }) as any;
        result.status= "success";
        result.mensagem = "Horário apagado com sucesso";

        return res.status(201).json(result);
    }
}
