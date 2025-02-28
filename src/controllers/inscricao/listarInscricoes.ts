import { Inscricao } from "@prisma/client";
import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";
import { ListaInscricoesDTO } from "../../interface/InscricaoUsersDTO";



export class ListarInscricoesUseCase{
    async execute({ idTorneio}: ListaInscricoesDTO): Promise<any>{
        
        
        // Busca todos os campeonatos que o jogador está inscrito
        const inscricoes = await prisma.inscricao.findMany({
            select: {
                id: true,
                tenista1: {
                    select: {
                        tenista: {
                            select: {
                                nome: true
                            }
                        }
                    }
                },
                tenista2: {
                    select: {
                        tenista: {
                            select: {
                                nome: true
                            }
                        }
                    }
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