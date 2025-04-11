import { Ranking } from "@prisma/client";
import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";
import { CriaRankingDTO } from "../../interface/RankingDTO";



export class CriarRankingUseCase{
    async execute({ id_academia, nome, classes }: CriaRankingDTO): Promise<{ ranking: Ranking }>{

        const rankingExiste = await prisma.ranking.findFirst({
            where: {
                AND: [
                    {id_academia},
                    {nome}
                ]
            }
        });


        if(rankingExiste){
            console.log("\nResposta: ");
            
            console.log("Ranking Já cadastrado");
            throw new AppError('Ranking Já cadastrado');
        }


        classes.forEach(async (classe) => {
            const classeExiste = await prisma.classes.findFirst({
                where: {
                    AND: [
                        {id_academia},
                        {id: classe}
                    ]
                }
            });
    
            if(!classeExiste){
                console.log("\nResposta: ");
    
                console.log(`Classe ${classe} não encontrada`);
                throw new AppError("Erro ao cadastrar ranking");
            }
        });

        
        const ranking = await prisma.ranking.create({
            data: {
                nome,
                academia: {
                    connect: { id: id_academia }
                }
            }
        }) as any;


        if(!ranking){
            console.log("Erro ao cadastrar novo ranking ", ranking);
            throw new AppError('Erro ao cadastrar novo ranking\n\n\n' + ranking);
        }


        let classeRanking;
        for (let i = 0; i < classes.length; i++) {
            classeRanking = await prisma.classeRanking.create({
                data: {
                    classe: {
                        connect: { id: classes[i] }
                    },
                    ranking: {
                        connect: { id: ranking.id }
                    }
                }
            });

            if (!classeRanking)
                console.log("Erro ao cadastrar classe no ranking ", classeRanking);
        }


        console.log("Ranking cadastrado com sucesso");
        console.log(ranking);
        

        return {ranking};
    }
}