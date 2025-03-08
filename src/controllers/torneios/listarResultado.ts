import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";
import { ListarResultadoDTO } from "../../interface/TorneiosDTO";

export class ListarResultadoUseCase{
    async execute( { idTorneio }: ListarResultadoDTO): Promise<any>{

        // Busca o campeonato caso seja do criador
        let torneio = await prisma.torneios.findUnique({
            where: {
                id: idTorneio
            }
        });

        console.log("\n\nResposta: ");

        if (!torneio) {
            console.log("Torneio não encontrado");
            throw new AppError('Torneio não encontrado');
        }

        if( torneio.id_status !== Number(process.env.STATUS_FINALIZADO) ){
            console.log("Torneio não finalizado");
            throw new AppError('Torneio não finalizado');
        }


        // Lista os resultados do torneio agrupados por classe
        const resultados = await prisma.classeTorneio.findMany({
            where: {
                id_torneio: idTorneio
            },
            select: {
                id: true,
                classeRanking: {
                    select: {
                        classe: {
                            select: {
                                id: true,
                                nome: true,
                                sigla: true,
                                masculino: true,
                                dupla: true,
                                misto: true
                            }
                        }
                    }
                },
                inscricao: {
                    select: {
                        id: true,
                        tenistasInscricao: {
                            select: {
                                tenistaAcademia: {
                                    select: { tenista: { select: { nome: true } } }
                                }
                            }
                        },
                        pontuacaoRanking: {
                            select: {
                                posicao: true,
                                pontuacao: true
                            }
                        }
                    }
                }
            }
        });

        
        console.log(`Resultados do torneio ${idTorneio} listados com sucesso`);


        return { resultados };
    }
}