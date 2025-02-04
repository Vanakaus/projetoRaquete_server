import { Request, Response } from "express";
import { CriarClasseUseCase } from "./criarClasse";
import { ListarClassesUseCase } from "./listarClasses";
import { AtualizarClasseUseCase } from "./atualizarClasse";

const jwt = require('jsonwebtoken');



export class ListarClassesController {
    async handle(req: Request, res: Response) {
        
        const listarClassesUseCase = new ListarClassesUseCase();
        
        const token = req.headers['x-access-token']

        var id_academia = '';
        jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: { login: string, id_academia: string }) => {
            id_academia = decoded.id_academia;
        });

        const result = await listarClassesUseCase.execute({ id_academia }) as any;
        return res.status(201).json(result);
    }
}



export class CriarClasseController {
    async handle(req: Request, res: Response) {
        
        const criaClasseUseCase = new CriarClasseUseCase();

        const { sigla, nome, masculino, misto, dupla } = req.body;
        const token = req.headers['x-access-token']
        
        var id_academia = '';
        jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: { login: string, id_academia: string }) => {
            id_academia = decoded.id_academia;
        });

        const result = await criaClasseUseCase.execute({ id_academia, sigla, nome, masculino, misto, dupla }) as any;
        result.status= "success";
        result.mensagem = "Classe cadastrada com sucesso";

        return res.status(201).json(result);
    }
}



export class AtualizarClasseController {
    async handle(req: Request, res: Response) {
        
        const atualizarClasseUseCase = new AtualizarClasseUseCase();

        const { id, sigla, nome, masculino, misto, dupla } = req.body;

        const result = await atualizarClasseUseCase.execute({ id, sigla, nome, masculino, misto, dupla }) as any;
        result.status= "success";
        result.mensagem = "Classe atualizada com sucesso";

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