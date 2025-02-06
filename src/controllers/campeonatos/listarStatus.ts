import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";
import { ListaTorneiosAcademiaDTO } from "../../interface/TorneiosDTO";

export class ListarStatusUseCase{
    async execute(): Promise<any>{

        console.log("Listando Status dos Torneios");

        // Busca todos os torneios da academia
        const listaStatus = await prisma.status.findMany({
            select: {
                id: true,
                nome: true,
            },
            orderBy: {
                id: 'asc'
            }
        });

        console.log("\nResposta: ");

        if (listaStatus.length === 0) {
            console.log("Nenhum Status encontrado");
            throw new AppError('Nenhum Status encontrado');
        }

        console.log(listaStatus.length + " Status Listados com sucesso");
        
        return { listaStatus };
    }
}