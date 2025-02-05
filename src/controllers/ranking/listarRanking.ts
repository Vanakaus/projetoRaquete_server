import { listarClassesDTO } from "../../interface/ClasseDTO";
import { prisma } from "../../prisma/client";



export class ListarRankingUseCase{
    async execute( {id_academia}: listarClassesDTO ): Promise<any>{

        const ranking = await prisma.ranking.findMany({
            select: {
                id: true,
                nome: true
            },
            where: {
                id_academia: id_academia
            }

        });

        console.log("Resposta: ");
        console.log(ranking.length + "  Rankings listados com sucesso");
        
        return {ranking};
    }
}