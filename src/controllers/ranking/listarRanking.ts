import { listarRankingDTO } from "../../interface/RankingDTO";
import { prisma } from "../../prisma/client";



export class ListarRankingUseCase{
    async execute( {id_academia}: listarRankingDTO ): Promise<any>{

        const ranking = await prisma.ranking.findMany({
            select: {
                id: true,
                nome: true
            },
            where: {
                id_academia
            }

        });

        console.log("Resposta: ");
        console.log(ranking.length + "  Rankings listados com sucesso");
        
        return {ranking};
    }
}