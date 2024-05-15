import { Request, Response } from "express";
import { CreateCampeonatoUseCase } from "./createCampeonato";
import { ListaCampeonatosUseCase } from "./listaCampeonatos";
import { LeCampeonatoUseCase } from "./leCampeonato";

const jwt = require('jsonwebtoken');



export class CreateCampeonatoController {
    async handle(req: Request, res: Response) {
        
        var cpfToken = '';
        const { cpf, nome, descricao, regras, classe, numJogadores, premiacao, local, dataInicio, dataFim } = req.body;
        const token = req.headers['x-access-token']

        jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: { cpf: string; }) => {
            cpfToken = decoded.cpf;
        });


        const createCampeonatoUseCase = new CreateCampeonatoUseCase();
        
        const result = await createCampeonatoUseCase.execute({ cpfToken, cpf, nome, descricao, regras, classe, numJogadores, premiacao, local, dataInicio, dataFim}) as any;
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


export class LeCampeonatoController {
    async handle(req: Request, res: Response) {
        
        const { id, cpf } = req.query;
        const leCampeonatoUseCase = new LeCampeonatoUseCase();
        
        const result = await leCampeonatoUseCase.execute({id: id?.toString() ?? '', cpf: cpf?.toString() ?? ''});
        return res.status(201).json(result);
    }
}



// export class LoginUserController {
//     async handle(req: Request, res: Response) {
        
//         const { email, senha } = req.body;
//         const loginUserUseCase = new LoginUserUseCase();
        
//         // Busca o usuário no banco de dados e adiciona campos ao objeto retornado
//         const result = await loginUserUseCase.execute({ email, senha }) as any;

        
//         // Gera o token JWT
//         const cpf = result.cpf;
//         const token = jwt.sign({ cpf }, process.env.JWT_SECRET, {
//             expiresIn: '1h'
//         });


//         result.status= "success";
//         result.mensagem = "Login efetuado com sucesso";
//         result.JWT = token;

//         return res.status(201).json(result);
//     }
// }



// export class UpdateUserController {
//     async handle(req: Request, res: Response) {
        
//         const { email, novoEmail, username, telefone, celular } = req.body;
//         const updateUserUseCase = new UpdateUserUseCase();
        
//         const result = await updateUserUseCase.execute({ email, novoEmail, username, telefone, celular }) as any;
//         result.status= "success";
//         result.mensagem = "Dados atualizados com sucesso";

//         return res.status(201).json(result);
//     }
// }



// export class UpdatePasswordController {
//     async handle(req: Request, res: Response) {
        
//         const { email, senha, novaSenha } = req.body;
//         const updateUserUseCase = new UpdatePasswordUseCase();
        
//         const result = await updateUserUseCase.execute({ email, senha, novaSenha }) as any;
//         result.status= "success";
//         result.mensagem = "Senha atualizada com sucesso";

//         return res.status(201).json(result);
//     }
// }