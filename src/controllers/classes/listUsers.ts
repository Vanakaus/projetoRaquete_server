import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";

export class ListUserUseCase{
    async execute(): Promise<any>{

        const users = await prisma.user.findMany(
            {
                select: {
                    cpf: true,
                    username: true,
                    nome: true,
                    sobrenome: true,
                    email: true,
                    senha: false,
                    dataNascimento: false,
                    telefone: true,
                    celular: true,
                    cargo: false,
                    rank: true
                }
            }
        );

        console.log("Resposta: ");

        if(users.length === 0){
            console.log("Sem Usuários cadastrados");
            throw new AppError('Sem Usuários cadastrados');
        }

        console.log(users.length + " Usuários Listados com sucesso");
        
        return users;
    }
}