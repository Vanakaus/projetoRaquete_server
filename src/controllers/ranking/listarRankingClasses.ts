import { listarRankingClassesDTO } from "../../interface/RankingDTO";
import { prisma } from "../../prisma/client";



export class ListarRankingClassesUseCase{
    async execute( {id_ranking}: listarRankingClassesDTO ): Promise<any>{

        const rankingClasses = await prisma.classeRanking.findMany({
            select: {
                id: true,
                id_ranking: true,
                classe: {
                    select: {
                        id: true,
                        sigla: true,
                        nome: true,
                        dupla: true,
                        masculino: true,
                        misto: true
                    }
                }
            },
            where: {
                id_ranking
            }

        });

        console.log("Resposta: ");
        console.log(rankingClasses.length + "  Classes do ranking listados com sucesso");
        
        return {rankingClasses};
    }
}