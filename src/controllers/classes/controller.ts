import { Request, Response } from "express";
import { CriarClasseUseCase } from "./criarClasse";
import { ListarClassesUseCase } from "./listarClasses";

const jwt = require('jsonwebtoken');



export class ListarClassesController {
    async handle(req: Request, res: Response) {
        
        const listarClassesUseCase = new ListarClassesUseCase();
        
        const result = await listarClassesUseCase.execute();
        return res.status(201).json(result);
    }
}



export class CriarClasseController {
    async handle(req: Request, res: Response) {
        
        const criaClasseUseCase = new CriarClasseUseCase();

        const { sigla, nome, masculino, dupla } = req.body;
        const token = req.headers['x-access-token']
        
        var id_academia = '';
        jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: { login: string, id_academia: string }) => {
            id_academia = decoded.id_academia;
        });

        const result = await criaClasseUseCase.execute({ id_academia, sigla, nome, masculino, dupla }) as any;
        result.status= "success";
        result.mensagem = "Classe cadastrada com sucesso";

        return res.status(201).json(result);
    }
}



// export class ListUserController {
//     async handle(req: Request, res: Response) {
        
//         const listUserUseCase = new ListUserUseCase();
        
//         const result = await listUserUseCase.execute();
//         return res.status(201).json(result);
//     }
// }



// export class AtualizaUserController {
//     async handle(req: Request, res: Response) {
        
        
//         var cpf = '';
//         const { email, novoEmail, username, telefone, celular } = req.body;
//         const token = req.headers['x-access-token']

//         jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: { cpf: string; }) => {
//             cpf = decoded.cpf;
//         });


//         const atualizaUserUseCase = new AtualizaUserUseCase();
        
//         const result = await atualizaUserUseCase.execute({ cpf, email, novoEmail, username, telefone, celular }) as any;
//         result.status= "success";
//         result.mensagem = "Dados atualizados com sucesso";

//         return res.status(201).json(result);
//     }
// }



// export class AtualizaPasswordController {
//     async handle(req: Request, res: Response) {
        
//         var cpf = '';
//         const { email, senha, novaSenha } = req.body;
//         const token = req.headers['x-access-token']

//         jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: { cpf: string; }) => {
//             cpf = decoded.cpf;
//         });


//         const atualizaUserUseCase = new AtualizaPasswordUseCase();
        
//         const result = await atualizaUserUseCase.execute({ cpf, email, senha, novaSenha }) as any;
//         result.status= "success";
//         result.mensagem = "Senha atualizada com sucesso";

//         return res.status(201).json(result);
//     }
// }