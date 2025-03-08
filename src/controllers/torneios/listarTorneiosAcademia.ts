import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";
import { ListaTorneiosAcademiaDTO } from "../../interface/TorneiosDTO";

export class ListarTorneiosAcademiaUseCase{
    async execute({ id_academia }: ListaTorneiosAcademiaDTO): Promise<any>{

        console.log("Buscando Torneios da Academia: " + id_academia);

        // Busca todos os torneios da academia
        const torneios = await prisma.torneios.findMany({
            where: {
                id_academia
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
                
            },
            orderBy: {
                dataInicio: 'asc'
            }
        });

        console.log("\nResposta: ");

        if (torneios.length === 0) {
            console.log("Sem Campeonatos cadastrados");
            throw new AppError('Sem Campeonatos cadastrados');
        }

        console.log(torneios.length + " Campeonatos Listados com sucesso");
        
        return {torneios};
    }
}