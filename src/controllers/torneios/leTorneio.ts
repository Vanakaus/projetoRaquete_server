import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";
import { LeTorneioDTO } from "../../interface/TorneiosDTO";

export class LerTorneioUseCase{
    async execute({ id }: LeTorneioDTO): Promise<any>{
        console.log("Buscando campeonato: " + id);

        // Busca todos os campeonatos e o seus criadores
        const torneio = await prisma.torneios.findUnique({
            where: {
                id
            },
            select: {
                id: true,
                nome: true,
                descricao: true,
                local: true,
                simples: true,
                duplas: true,
                sets: true,
                tiebreak: true,
                dataInicio: true,
                dataFim: true,

                status: {
                    select: {
                        id: true,
                        nome: true
                    }
                },
                pontuacoes: {
                    select: {
                        id: true,
                        participacao: true,
                        vencedor: true,
                        r32: true,
                        r16: true,
                        r8: true,
                        r4: true,
                        r2: true,
                        r1: true
                    }
                },
                ClasseTorneio: {
                    select: {
                        id: true,
                        cabecasChave: true,
                        classeRanking: {
                            select: {
                                id: true,
                                classe: {
                                    select: {
                                        id: true,
                                        sigla: true,
                                        nome: true,
                                        masculino: true,
                                        dupla: true,
                                        misto: true,
                                    }
                                },
                                ranking: {
                                    select: {
                                        nome: true,
                                    }
                                }
                            }
                        },
                        _count: {
                            select: {
                                Inscricao: true
                            }
                        }
                    },
                },
                
            }
        });

        console.log("Resposta: ");

        if (!torneio) {
            console.log("Torneio não encontrado");
            throw new AppError('Torneio não encontrado', 404);
        }

        console.log(torneio);
        
        return { torneio };
    }
}