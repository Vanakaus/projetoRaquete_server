import { Request, Response } from "express";
import { CreateUserUseCase } from "./createUser";
import { ListUserUseCase } from "./listUsers";
import { LoginUserUseCase } from "./loginUser";



export class CreateUserController {
    async handle(req: Request, res: Response) {
        
        const { cpf, email, senha, nome, sobrenome, dataNascimento, username, telefone, celular } = req.body;
        const createUserUseCase = new CreateUserUseCase();
        
        const result = await createUserUseCase.execute({ cpf, email, senha, nome, sobrenome, dataNascimento, username, telefone, celular }) as any;
        result.status= "success";
        result.Resposta = "Usuário cadastrado com sucesso";

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
        result.status= "success";
        result.Resposta = "Login efetuado com sucesso";
        result.JWT = "token123";

        return res.status(201).json(result);
    }
}