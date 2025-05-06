import { Request, Response } from "express";
import { LoginUserUseCase } from "./loginUser";
import { AtualizaSenhaUseCase } from "./atualizaSenha";
import { CriaAcademiaUseCase } from "./criaAcademia";
import { CriaUsuarioUseCase } from "./criaUsuario";
import { LeAcademiaUseCase } from "./leAcademia";

const jwt = require('jsonwebtoken');



export class VerificaJWTController {
    async handle(req: Request, res: Response) {
        return res.status(201).json({
            status: "success",
            mensagem: "Token válido, acesso permitido" });
    }
}



export class LoginUserController {
    async handle(req: Request, res: Response) {
        
        const { login, senha } = req.body;
        const loginUserUseCase = new LoginUserUseCase();
        
        // Busca o usuário no banco de dados e adiciona campos ao objeto retornado
        const result = await loginUserUseCase.execute({ login, senha }) as any;
        
        // Gera o token JWT
        const token = jwt.sign({ login, id_academia: result.id_academia }, process.env.JWT_SECRET, {
            expiresIn: '4h'
        });


        result.status= "success";
        result.mensagem = "Login efetuado com sucesso";
        result.JWT = token;

        return res.status(201).json(result);
    }
}



export class CriaAcademiaController {
    async handle(req: Request, res: Response) {
        
        const { id, nome } = req.body;
        const criaAcademiaUseCase = new CriaAcademiaUseCase();
        
        const result = await criaAcademiaUseCase.execute({ id, nome }) as any;
        result.status= "success";
        result.mensagem = "Academia cadastrada com sucesso";

        return res.status(201).json(result);
    }
}



export class LeAcademiaController {
    async handle(req: Request, res: Response) {
        
        const token = req.headers['x-access-token']
        var id = '';
        jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: { id_academia: string; }) => {
            id = decoded.id_academia;
        });

        const leAcademiaUseCase = new LeAcademiaUseCase();
        
        const result = await leAcademiaUseCase.execute({ id });
        result.status= "success";
        result.mensagem = "Academia encontrada com sucesso";

        return res.status(201).json(result);
    }
}



export class CriaUsuarioController {
    async handle(req: Request, res: Response) {
        
        const { login, nome, senha, id_academia } = req.body;
        const criaUserUseCase = new CriaUsuarioUseCase();
        
        const result = await criaUserUseCase.execute({ login, nome, senha, id_academia }) as any;
        result.status= "success";
        result.mensagem = "Usuário cadastrado com sucesso";

        return res.status(201).json(result);
    }
}



export class AtualizaSenhaController {
    async handle(req: Request, res: Response) {
        
        var cpf = '';
        const { login, novaSenha } = req.body;
        const token = req.headers['x-access-token']

        jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: { cpf: string; }) => {
            cpf = decoded.cpf;
        });


        const atualizaUserUseCase = new AtualizaSenhaUseCase();
        
        const result = await atualizaUserUseCase.execute({ login, novaSenha }) as any;
        result.status= "success";
        result.mensagem = "Senha atualizada com sucesso";

        return res.status(201).json(result);
    }
}