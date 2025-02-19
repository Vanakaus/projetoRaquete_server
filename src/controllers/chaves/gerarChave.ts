import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";
import { GerarChaveDTO } from "../../interface/ChavesDTO";
import formataNumero from "../../functions/formatarNumero";



export class GerarChaveUseCase{
    async execute({ idTorneio, idClasseTorneio, numCabecas}: GerarChaveDTO): Promise<any>{

        // Verifica se o torneio existe e qual seu status
        let torneio = await prisma.torneios.findUnique({
            where: {
                id: idTorneio
            },
            select: {
                status: true
            }
        }) as any;
        
        
        console.log("\nResposta: ");

        if(!torneio){
            console.log("Torneio não encontrado");
            throw new AppError('Torneio inválido\n\n\n' + torneio);
        }

        if(torneio.status.id > Number(process.env.STATUS_INSCRICOES_ENCERRADAS)){
            console.log("Não é possível gerar chave \nTorneio Status: " + torneio.status);
            throw new AppError('Não é possível gerar chave. Torneio Status: ' + torneio.status.nome);
        }



        // Verifica se a classe do torneio existe, e se possui jogos gerados
        const classe = await prisma.classeTorneio.findUnique({
            where: {
                id: idClasseTorneio
            },
            select: {
                cabecasChave: true,
                classeRanking: {
                    select: {
                        classe: {
                            select: {
                                id: true,
                                nome: true,
                                dupla: true
                            }
                        }
                    }
                }
            }
        });

        if(!classe){
            console.log("Classe não encontrada");
            throw new AppError('Classe inválida');
        }

        if(classe.cabecasChave !== -1){
            console.log("Partidas já geradas para esta classe");
            throw new AppError('Partidas já geradas para esta classe');
        }



        // Busca todos os incritos no campeonato
        const inscricoes = await prisma.inscricao.findMany({
            select: {
                id: true,
                id_tenistaAcademia: true,
                id_tenistaAcademia2: true
            },
            where: {
                id_classeTorneio: idClasseTorneio
            },
            orderBy: {
                id: 'asc'
            }
        }) as any;



        // REVER QUAIS CRITEIRIOS SERÃO UTILIZADOS PARA LER A PONTUAÇÃO
        // PERIODO DE TEMPO, ULTIMOS X RESULTADOS, DESDE DE O INICIO DO RANKING
        // SEPARADO POR CLASSE, SEPARADO POR DUPLA, OU TUDO JUNTO
        // Adiciona a pontuacao de cada jogador
        for(let i = 0; i < inscricoes.length; i++){

            const pontuacao = await prisma.pontuacaoRanking.aggregate({
                where: {
                    AND: [
                        { inscricao: {
                            OR: [
                                { id_tenistaAcademia: inscricoes[i].id_tenistaAcademia },
                                { id_tenistaAcademia2: inscricoes[i].id_tenistaAcademia2 },
                                { id_tenistaAcademia2: inscricoes[i].id_tenistaAcademia },
                                { id_tenistaAcademia2: inscricoes[i].id_tenistaAcademia2 }
                            ],
                        }},
                        { inscricao: {
                            classeTorneio: {
                                classeRanking: {
                                    classe: {
                                        id: classe.classeRanking.classe.id
                                    }
                                }
                            }
                        }}
                    ]
                },
                _sum: {
                    pontuacao: true
                }
            });

            inscricoes[i].pontuacao = pontuacao._sum.pontuacao || 0;
        }



        // Ordena os inscritos por pontuação
        inscricoes.sort((a: { pontuacao: number; }, b: { pontuacao: number; }) => {
            return b.pontuacao - a.pontuacao;
        });



        // Gera as chaves
        const qtdInscritos = inscricoes.length;
        let qtdPartidas = 2;

        for(qtdPartidas; qtdPartidas < qtdInscritos; qtdPartidas = qtdPartidas * 2);


        console.log("Quantidade de inscritos no campeonato: " + qtdInscritos);
        console.log("Quantidade total de inscritos possíveis: " + qtdPartidas--);

        console.log("\nInsrcrições: ");
        console.log(inscricoes);
        console.log("\n\n");


        console.log("\nChaves: ");
        for(let i = 0; i < qtdPartidas/2; i++){

            let chave = (i % 2 === 0) ?
            formataNumero((qtdPartidas + 1) / 2) + ":" + formataNumero(Math.ceil((i + 1)/2)) :
            formataNumero((qtdPartidas + 1) / 2) + ":" + formataNumero(Math.ceil(qtdPartidas/4 + i/2));


            console.log("Chave: ", chave);
            console.log("\tJogador 1:");
            console.log("\t\tID: " + inscricoes[i].id);
            // console.log("\t\tApelido: " + inscricoes[i].jogador.username);
            // console.log("\t\tNome: " + inscricoes[i].jogador.nome + " " + inscricoes[i].jogador.sobrenome);
            // console.log("\t\tRank: " + inscricoes[i].jogador.rank);


            if(qtdPartidas - i < qtdInscritos){

                console.log("\tJogador 2:");
                console.log("\t\tID: " + inscricoes[qtdPartidas - i].id);
                // console.log("\t\tApelido: " + inscricoes[qtdPartidas - i].jogador.username);
                // console.log("\t\tNome: " + inscricoes[qtdPartidas - i].jogador.nome + " " + inscricoes[qtdPartidas - i].jogador.sobrenome);
                // console.log("\t\tRank: " + inscricoes[qtdPartidas - i].jogador.rank);


                const partida = await prisma.partidas.create({
                    data: {
                        chave,
                        id_inscricao: inscricoes[i].id,
                        id_inscricao2: inscricoes[qtdPartidas - i].id,
                    }
                });
            } else {

                console.log("\tJogador 2:");
                console.log("\t\tID: ");
                // console.log("\t\tApelido: ");
                // console.log("\t\tNome: ");
                // console.log("\t\tRank: ");


                var partida = await prisma.partidas.create({
                    data: {
                        chave,
                        id_inscricao: inscricoes[i].id,
                    }
                });



                const novaChave = formataNumero( Number(partida.chave.substring(0, 2)) / 2 ) + ":" + formataNumero( Math.ceil(Number(partida.chave.substring(3, 5)) / 2) );

                partida = await prisma.partidas.create({
                    data: {
                        chave: novaChave,
                        id_inscricao: inscricoes[i].id,
                    }
                });
            }
            // console.log("\n\n");
        }


        const partidas = await  await prisma.partidas.findMany({
            select: {
                id: true,
                chave: true,
                inscricao1: {
                    select: {
                        id: true,
                        tenista1: {
                            select: {
                                tenista: {
                                    select: {
                                        nome: true,
                                    }
                                }
                            }
                        },
                        tenista2: {
                            select: {
                                tenista: {
                                    select: {
                                        nome: true,
                                    }
                                }
                            }
                        }
                    }
                },
                inscricao2: {
                    select: {
                        id: true,
                        tenista1: {
                            select: {
                                tenista: {
                                    select: {
                                        nome: true,
                                    }
                                }
                            }
                        },
                        tenista2: {
                            select: {
                                tenista: {
                                    select: {
                                        nome: true,
                                    }
                                }
                            }
                        }
                    }
                },
                id_vencedor: true,
                Sets: true,
                dataPartida: true,
                horaPartida: true,
                local: true,
            },
            where: {
                OR: [
                    { inscricao1: { id_classeTorneio: idClasseTorneio } },
                    { inscricao2: { id_classeTorneio: idClasseTorneio } }
                ]
            },
            orderBy: {
                chave: 'asc'
            }
        });

        
        
        // Atualiza a classe do torneio para informar que as chaves foram geradas com o número de cabeças de chave
        const classeTorneio = await prisma.classeTorneio.update({
            where: {
                id: idClasseTorneio
            },
            data: {
                cabecasChave: numCabecas
            }
        });
        
        
        console.log("\n\Jogos geradas com sucesso: ", partidas.length);



        // Verifica se há classes sem jogos gerados
        const torneioClasseEmBranco = await prisma.classeTorneio.findFirst({
            where: {
                id_torneio: idTorneio,
                cabecasChave: -1
            }
        });



        // Se não houver classes sem jogos gerados, atualiza o status do torneio para "Inscrições Encerradas"
        if(!torneioClasseEmBranco){
            torneio = await prisma.torneios.update({
                where: {
                    id: idTorneio
                },
                data: {
                    id_status: Number(process.env.STATUS_JOGOS_GERADOS)
                },
                select: {
                    status: {
                        select: {
                            id: true,
                            nome: true
                        }
                    }
                }
            });
        }

        return { torneio, partidas };
    }
}
