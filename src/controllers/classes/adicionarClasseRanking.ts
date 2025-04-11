import { User } from "@prisma/client";
import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";
import { AdicionarClasseRankingDTO } from "../../interface/ClasseDTO";



export class AdicionarClasseRankingUseCase{
    async execute({ id_academia, idClasse, idRanking }: AdicionarClasseRankingDTO): Promise<User>{
        
        const classeExiste = await prisma.classes.findFirst({
            where: {
                AND: [
                    {id_academia},
                    {id: idClasse}
                ]
            }
        });

        if(!classeExiste){
            console.log("\nResposta: ");

            console.log("Classe não encontrada");
            throw new AppError('Classe não encontrada');
        }



        const rankingExiste = await prisma.ranking.findFirst({
            where: {
                AND: [
                    {id_academia},
                    {id: idRanking}
                ]
            }
        });

        if(!rankingExiste){
            console.log("\nResposta: ");

            console.log("Ranking não encontrado");
            throw new AppError('Ranking não encontrado');
        }


        
        const classeRanking = await prisma.classeRanking.create({
            data: {
                id_classe: idClasse,
                id_ranking: idRanking
            }
        }) as any;

        if(!classeRanking){
            console.log("Erro ao adicionar classe ao ranking");
            console.log(classeRanking);
            throw new AppError('Erro ao adicionar classe ao ranking\n\n\n' + classeRanking);
        }

        console.log("Classe adicionada ao ranking com sucesso");
        console.log(classeRanking);
        

        return {classeRanking} as any;
    }
}