import { Request, Response } from "express";
import { CriaUserUseCase } from "./criaUser";
import { ListUserUseCase } from "./listUsers";
import { LoginUserUseCase } from "./loginUser";
import { AtualizaUserUseCase } from "./atualizaUser";
import { AtualizaPasswordUseCase } from "./atualizaPassword";

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
            expiresIn: '1h'
        });


        result.status= "success";
        result.mensagem = "Login efetuado com sucesso";
        result.JWT = token;

        return res.status(201).json(result);
    }
}



export class CriaUserController {
    async handle(req: Request, res: Response) {
        
        const { cpf, email, senha, nome, sobrenome, dataNascimento, username, telefone, celular } = req.body;
        const criaUserUseCase = new CriaUserUseCase();
        
        const result = await criaUserUseCase.execute({ cpf, email, senha, nome, sobrenome, dataNascimento, username, telefone, celular }) as any;
        result.status= "success";
        result.mensagem = "Usuário cadastrado com sucesso";

        return res.status(201).json(result);
    }
}



export class ListUserController {
    async handle(req: Request, res: Response) {
        
        const listUserUseCase = new ListUserUseCase();
        
        const result = await listUserUseCase.execute();
        return res.status(201).json(result);
    }
}



export class AtualizaUserController {
    async handle(req: Request, res: Response) {
        
        
        var cpf = '';
        const { email, novoEmail, username, telefone, celular } = req.body;
        const token = req.headers['x-access-token']

        jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: { cpf: string; }) => {
            cpf = decoded.cpf;
        });


        const atualizaUserUseCase = new AtualizaUserUseCase();
        
        const result = await atualizaUserUseCase.execute({ cpf, email, novoEmail, username, telefone, celular }) as any;
        result.status= "success";
        result.mensagem = "Dados atualizados com sucesso";

        return res.status(201).json(result);
    }
}



export class AtualizaPasswordController {
    async handle(req: Request, res: Response) {
        
        var cpf = '';
        const { email, senha, novaSenha } = req.body;
        const token = req.headers['x-access-token']

        jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: { cpf: string; }) => {
            cpf = decoded.cpf;
        });


        const atualizaUserUseCase = new AtualizaPasswordUseCase();
        
        const result = await atualizaUserUseCase.execute({ cpf, email, senha, novaSenha }) as any;
        result.status= "success";
        result.mensagem = "Senha atualizada com sucesso";

        return res.status(201).json(result);
    }
}