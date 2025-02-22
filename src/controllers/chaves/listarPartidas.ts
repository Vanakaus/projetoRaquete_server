import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";
import { ListarChaveDTO } from "../../interface/ChavesDTO";



export class ListarPartidasUseCase{
    async execute({ idTorneio }: ListarChaveDTO): Promise<any>{

        
        const torneio = await prisma.torneios.findUnique({
            where: {
                id: idTorneio
            }
        });


        console.log("\nResposta: ");

        if(!torneio){
            console.log("Torneio não encontrado");
            throw new AppError('Torneio não encontrado\n\n\n' + torneio);
        }

1
        console.log("Listando jogos do torneio: ");
        console.log("\tID: " + idTorneio);
        console.log("\tNome: " + torneio.nome);

        const partidas = await prisma.partidas.findMany({
            where: {
                OR: [
                    { inscricao1: { classeTorneio: { id_torneio: idTorneio } } },
                    { inscricao2: { classeTorneio: { id_torneio: idTorneio } } }
            ]},
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
                Sets: true,
                inscricao1: {
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
                    }
                },
                inscricao2: {
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
                    }
                },
            }
        });




        
        console.log("\n\nJogos listadas com sucesso: ", partidas.length);
        // console.log(partidas);
        console.log("\n\n");


        return {partidas};
    }
}

