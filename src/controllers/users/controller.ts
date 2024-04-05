import { Request, Response } from "express";
import { CreateUserUseCase } from "./createUser";
import { ListUserUseCase } from "./listUsers";



export class CreateUserController {
    async handle(req: Request, res: Response) {
        
        const { email, senha, nome, sobrenome, dataNascimento, username, telefone, celular } = req.body;
        const createUserUseCase = new CreateUserUseCase();
        
        const result = await createUserUseCase.execute({ email, senha, nome, sobrenome, dataNascimento, username, telefone, celular });
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