import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";

export class ListUserUseCase{
    async execute(): Promise<any>{

        const users = await prisma.user.findMany();

        console.log("Resposta: ");

        if(users.length === 0){
            console.log("Sem Usuários cadastrados");
            throw new AppError('Sem Usuários cadastrados');
        }
        
        return users;
    }
}