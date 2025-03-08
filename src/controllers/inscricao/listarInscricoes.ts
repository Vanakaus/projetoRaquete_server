import { Inscricao } from "@prisma/client";
import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";
import { ListaInscricoesDTO } from "../../interface/InscricaoUsersDTO";



export class ListarInscricoesUseCase{
    async execute({ idTorneio}: ListaInscricoesDTO): Promise<any>{
        
        
        // Busca todos os incritos no torneio
        const inscricoes = await prisma.inscricao.findMany({
            select: {
                id: true,
                TenistasInscricao: {
                    select: { 
                        tenistaAcademia: {
                            select: { tenista: { select: { nome: true } } }
                        }
                    },
                    orderBy: { ordem: 'asc' }
                },
                classeTorneio: {
                    select: {
                        classeRanking: {
                            select: {
                                classe: {
                                    select: {
                                        sigla: true
                                    }
                                }
                            }
                        }
                    }
                },
            },
            where: { classeTorneio: { id_torneio: idTorneio } }
        });


        console.log("\nResposta: ");

        if(!inscricoes){
            console.log("Sem inscrições no torneio");
            console.log(inscricoes);
            throw new AppError('Sem inscrições no torneio\n\n\n' + inscricoes);
            
        }

        console.log("Inscrições listadas: " + inscricoes.length);
        

        return {inscricoes};
    }
}