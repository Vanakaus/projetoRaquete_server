import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";
import { ContarJogadoresClasseDTO } from "../../interface/ClasseDTO";



export class ContarJogadoresClasseUseCase{
    async execute({ id_academia }: ContarJogadoresClasseDTO): Promise<any>{
        
        const classes = await prisma.classes.findMany({
            where: {
                id_academia
            },
            select: {
                id: true,
                sigla: true
            }
        }) as any;

        console.log("\nResposta: ");

        if (!classes) {
            console.log("Erro ao listar as classes");
            throw new AppError("Erro ao listar as classes", 404);
        }

        
        for( const classe of classes) {
            const jogadores = await prisma.tenistasAcademias.count({
                where: {
                    id_academia,
                    tenistasInscricao: { some: { inscricao: { classeTorneio: { classeRanking: { id_classe: classe.id } } } } }
                }
            });
            classe.jogadores = jogadores;
            delete classe.id;
        }

        console.log("Jogadores contados com sucesso: " + classes.reduce((acc: any, classe: any ) => acc + classe.jogadores, 0));

        return { jogadoresClasse: classes };
    }
}