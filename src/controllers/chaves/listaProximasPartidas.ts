import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";

export class ListaProximasPartidasUseCase{
    async execute(id_jogador: string): Promise<any>{

        const partidas = await prisma.partidas.findMany({
            select: {
                id: true,
                id_campeonato: true,
                chave: true,
                id_jogador1: true,
                id_jogador2: true,
                id_vencedor: true,
                dataPartida: true,
                id_data: true,
                id_local: true,
                placar1: true,
                placar2: true,
                campeonato: {
                    select: {
                        nome: true,
                        sets: true,
                    }
                },
                data: {
                    select: {
                        id: true,
                        horario: true
                    }
                },
                quadra: {
                    select: {
                        id: true,
                        nome: true
                    }
                },
                jogador1: {
                    select: {
                        jogador: {
                            select: {
                                username: true,
                                nome: true,
                                sobrenome: true,
                                rank: true
                            }
                        }
                    }
                },
                jogador2: {
                    select: {
                        jogador: {
                            select: {
                                username: true,
                                nome: true,
                                sobrenome: true,
                                rank: true
                            }
                        }
                    }
                }
            },
            where: {
                AND: [{
                        OR: [{
                            jogador1: {
                                id_jogador
                            }
                        },
                        {
                            jogador2: {
                                id_jogador
                            }
                        }]
                    },
                    { OR: [{
                            dataPartida: {
                                gte: new Date()
                            }
                        },
                        {
                            id_vencedor: {
                                equals: null
                            }
                        }]
                    },
                    {
                        dataPartida: {
                            not: null
                        }
                    }
                ]
            },
            orderBy: {
                dataPartida: 'asc'
            },
            take: 15
        });

        
        console.log("Resposta: ");

        if (partidas.length === 0) {
            console.log("Não há partidas próximas");
            throw new AppError('Não há partidas próximas', 404);
        }

        console.log(partidas.length + " Partidas Listadas com sucesso");
        
        return {partidas};
    }
}