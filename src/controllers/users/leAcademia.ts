import { prisma } from "../../prisma/client";
import { LeAcademiaDTO, } from "../../interface/UsersDTO";
import { AppError } from "../../errors/AppErrors";



export class LeAcademiaUseCase{
    async execute({ id }: LeAcademiaDTO): Promise<any>{
        
        const academia = await prisma.academias.findUnique({
            where: { id },
            select: { nome: true }
        });

        console.log("\nResposta: ");

        if(!academia) {
            throw new AppError("Academia não encontrada", 404);
        }

        console.log(academia.nome);

        return academia;
    }
}