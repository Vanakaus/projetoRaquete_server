import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";

export class ListaProximasPartidasUseCase{
    async execute(id_jogador: string): Promise<any>{

        const partidas = await prisma.partidas.findMany({
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
        
        return partidas;
    }
}