import { Request, Response } from "express";
import { CreateUserUseCase } from "./createUser";
import { ListUserUseCase } from "./listUsers";
import { LoginUserUseCase } from "./loginUser";
import { UpdateUserUseCase } from "./updateUser";
import { UpdatePasswordUseCase } from "./updatePassword";

const jwt = require('jsonwebtoken');



export class VerificaJWTController {
    async handle(req: Request, res: Response) {
        return res.status(201).json({
            status: "success",
            mensagem: "Token válido, acesso permitido" });
    }
}



export class CreateUserController {
    async handle(req: Request, res: Response) {
        
        const { cpf, email, senha, nome, sobrenome, dataNascimento, username, telefone, celular } = req.body;
        const createUserUseCase = new CreateUserUseCase();
        
        const result = await createUserUseCase.execute({ cpf, email, senha, nome, sobrenome, dataNascimento, username, telefone, celular }) as any;
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



export class LoginUserController {
    async handle(req: Request, res: Response) {
        
        const { email, senha } = req.body;
        const loginUserUseCase = new LoginUserUseCase();
        
        // Busca o usuário no banco de dados e adiciona campos ao objeto retornado
        const result = await loginUserUseCase.execute({ email, senha }) as any;

        
        // Gera o token JWT
        const cpf = result.cpf;
        const token = jwt.sign({ cpf }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });


        result.status= "success";
        result.mensagem = "Login efetuado com sucesso";
        result.JWT = token;

        return res.status(201).json(result);
    }
}



export class UpdateUserController {
    async handle(req: Request, res: Response) {
        
        
        var cpf = '';
        const { email, novoEmail, username, telefone, celular } = req.body;
        const token = req.headers['x-access-token']
        

        jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: { cpf: string; }) => {
            cpf = decoded.cpf;
        });

        console.log(cpf);


        const updateUserUseCase = new UpdateUserUseCase();
        
        const result = await updateUserUseCase.execute({ cpf, email, novoEmail, username, telefone, celular }) as any;
        result.status= "success";
        result.mensagem = "Dados atualizados com sucesso";

        return res.status(201).json(result);
    }
}



export class UpdatePasswordController {
    async handle(req: Request, res: Response) {
        
        const { email, senha, novaSenha } = req.body;
        const updateUserUseCase = new UpdatePasswordUseCase();
        
        const result = await updateUserUseCase.execute({ email, senha, novaSenha }) as any;
        result.status= "success";
        result.mensagem = "Senha atualizada com sucesso";

        return res.status(201).json(result);
    }
}