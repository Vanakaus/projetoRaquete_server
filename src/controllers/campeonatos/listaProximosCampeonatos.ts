import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";

export class ListaProximosCampeonatosUseCase{
    async execute(id_jogador: string): Promise<any>{

        const campeonatos = await prisma.campeonatos.findMany({
            where: {
                AND: [{
                        inscricoes: {
                            some: {
                                jogador: {
                                    cpf: id_jogador
                                }
                            }
                        }
                    },
                    { OR: [{
                            dataInicio: {
                                gte: new Date()
                            }
                        },
                        {
                            dataFim: {
                                lte: new Date()
                            }
                        }]
                    }]
            },
            orderBy: {
                dataInicio: 'asc'
            },
            take: 5
        });

        
        console.log("Resposta: ");

        if (campeonatos.length === 0) {
            console.log("Não há campeonatos próximos");
            throw new AppError('Não há campeonatos próximos', 404);
        }

        console.log(campeonatos.length + " Campeonatos Listados com sucesso");
        
        return campeonatos;
    }
}