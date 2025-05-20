import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";
import { ListarChaveDTO } from "../../interface/ChavesDTO";



export class ListarPartidasUseCase{
    async execute({ id_torneio }: ListarChaveDTO): Promise<any>{

        
        const torneio = await prisma.torneios.findUnique({
            where: {
                id: id_torneio
            }
        });


        console.log("\nResposta: ");

        if(!torneio){
            console.log("Torneio não encontrado");
            throw new AppError('Torneio não encontrado\n\n\n' + torneio);
        }

        
        console.log("Listando jogos do torneio: ");
        console.log("\tID: " + id_torneio);
        console.log("\tNome: " + torneio.nome);

        const partidas = await prisma.partidas.findMany({
            where: {
                classeTorneio: {
                    id_torneio
                }
            },                
            orderBy: {
                chave: 'asc'
            },
            select: {
                id: true,
                chave: true,
                id_vencedor: true,
                dataPartida: true,
                horaPartida: true,
                local: true,
                sets: {
                    select: {
                        id: true,
                        tiebreak: true,
                        pontTen1: true,
                        pontTen2: true
                    }
                },
                classeTorneio: { select: { classeRanking: { select: { classe: { select: { sigla: true } } } } } },
                inscricaoPartida: {
                    select: {
                        ordem: true,
                        inscricao: {
                            select: {
                                id: true,
                                tenistasInscricao: {
                                    select: { tenistaAcademia: { select: { tenista: { select: { nome: true } } } } },
                                    orderBy: { ordem: 'asc' }
                                }
                            }
                        }
                    },
                    orderBy: { ordem: 'asc' }
                }
            }
        });




        
        console.log("\n\nJogos listadas com sucesso: ", partidas.length);
        // console.log(partidas);
        console.log("\n\n");


        return {partidas};
    }
}

