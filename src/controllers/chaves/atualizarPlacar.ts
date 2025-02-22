import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";
import { AtualizarPlacarDTO, novaPartidaPlacarRespostaDTO, partidaPlacarDTO, partidaPlacarRespostaDTO } from "../../interface/ChavesDTO";
import formataNumero from "../../functions/formatarNumero";



export class AtualizarPlacarUseCase{
    async execute({ novosPlacares }: AtualizarPlacarDTO): Promise<any>{

        console.log("\nResposta: ");

        // Variaveis para armazenar as partidas atualizadas e não atualizadas na resposta
        const partidasAtualizadas = [] as partidaPlacarRespostaDTO[];
        const partidasNaoAtualizadas = [] as partidaPlacarDTO[];
        const novasPartidas = [] as novaPartidaPlacarRespostaDTO[];

        // Percorre todas as partidas
        for(const novoPlacar of novosPlacares){

            // Verifica se a partida é válida
            const partida = await prisma.partidas.findUnique({
                where: {
                    id: novoPlacar.id
                },
                select: {
                    chave: true,
                    id_inscricao: true,
                    id_inscricao2: true,
                    inscricao1: {
                        select: {
                            id_classeTorneio: true
                        }
                    },
                    inscricao2: {
                        select: {
                            id_classeTorneio: true
                        }
                    },
                }
            });

            if(!partida){
                partidasNaoAtualizadas.push(novoPlacar);
                continue;
            }


            // Variavel para verificar e salvar o id do vencedor
            let id_vencedor = 0;

            // percurre todos os sets
            for(const set of novoPlacar.sets){

                // Verifica se o set existe(será atualizado ou criado)
                if(set.id === -1){

                    // Criando set
                    const novoSet = await prisma.sets.create({
                        data: {
                            id_partida: novoPlacar.id,
                            tiebreak: set.tiebreak,
                            pontTen1: set.placar[0],
                            pontTen2: set.placar[1],
                        }
                    });

                    if(!novoSet){
                        partidasNaoAtualizadas.push(novoPlacar);
                        break;
                    }
                    
                    set.id = novoSet.id;
                }else{

                    // Atualizando set
                    // Verifica se o set existe
                    const setExiste = await prisma.sets.findUnique({
                        where: {
                            id: set.id
                        }
                    });

                    if(!setExiste){
                        partidasNaoAtualizadas.push(novoPlacar);
                        break;
                    }


                    // Atualiza o set
                    const setAtualizado = await prisma.sets.update({
                        where: {
                            id: set.id
                        },
                        data: {
                            tiebreak: set.tiebreak,
                            pontTen1: set.placar[0],
                            pontTen2: set.placar[1]
                        }
                    });

                    if(!setAtualizado){
                        partidasNaoAtualizadas.push(novoPlacar);
                        break;
                    }
                }


                if(set.placar[0] > set.placar[1])
                    id_vencedor++;
                else if(set.placar[0] < set.placar[1])
                    id_vencedor--;


                // Verifica se é o ultimo set
                if(novoPlacar.sets.indexOf(set) === novoPlacar.sets.length - 1){

                    if(id_vencedor > 0)
                        id_vencedor = partida.id_inscricao || -1;
                    else if(id_vencedor < 0)
                        id_vencedor = partida.id_inscricao2 || -1;
                    else
                        id_vencedor = -1;

                    // Atualiza o vencedor da partida
                    const partidaAtualizada = await prisma.partidas.update({
                        where: {
                            id: novoPlacar.id
                        },
                        data: {
                            id_vencedor: id_vencedor === -1 ? undefined : id_vencedor
                        }
                    });

                    if(!partidaAtualizada){
                        partidasNaoAtualizadas.push(novoPlacar);
                        continue;
                    }
                    
                    partidasAtualizadas.push({ ...novoPlacar, id_vencedor });



                    // Atualiza ou cria a próxima partida
                    const novaChave = formataNumero( Number(partida.chave.substring(0, 2)) / 2 ) + ":" + formataNumero( Math.ceil(Number(partida.chave.substring(3, 5)) / 2) );
                    let novaPartida = null;


                    // Verifica se a próxima partida já existe
                    const novaPartidaExiste = await prisma.partidas.findFirst({
                        where: {
                            AND: {
                                OR: [
                                    { inscricao1: { id_classeTorneio: partida.inscricao1?.id_classeTorneio || partida.inscricao2?.id_classeTorneio } },
                                    { inscricao2: { id_classeTorneio: partida.inscricao2?.id_classeTorneio || partida.inscricao1?.id_classeTorneio } }
                                ],
                                chave: novaChave
                            }
                        }
                    });

                    if(novaPartidaExiste){

                        // Verifica qual o jogador que será atualizado
                        if(Number(partida.chave.substring(3, 5)) % 2 === 1){

                            // Atualiza jogador 1
                            novaPartida = await prisma.partidas.update({
                                where: {
                                    id: novaPartidaExiste.id
                                },
                                data: {
                                    id_inscricao: id_vencedor === -1 ? null : id_vencedor
                                },
                                select: {
                                    id: true,
                                    chave: true,
                                    id_vencedor: true,
                                    inscricao1: {
                                        select: {
                                            id: true,
                                            classeTorneio: { select: { classeRanking: { select: { classe: { select: { nome: true } } } } } },
                                            tenista1: { select: { tenista: { select: { nome: true} } } },
                                            tenista2: { select: { tenista: { select: { nome: true} } } }
                                        }
                                    },
                                    inscricao2: {
                                        select: {
                                            id: true,
                                            classeTorneio: { select: { classeRanking: { select: { classe: { select: { nome: true } } } } } },
                                            tenista1: { select: { tenista: { select: { nome: true} } } },
                                            tenista2: { select: { tenista: { select: { nome: true} } } }
                                        }
                                    },
                                }
                            });

                        }else if(Number(partida.chave.substring(3, 5)) % 2 === 0){

                            // Atualiza jogador 2
                            novaPartida = await prisma.partidas.update({
                                where: {
                                    id: novaPartidaExiste.id
                                },
                                data: {
                                    id_inscricao2: id_vencedor === -1 ? null : id_vencedor
                                },
                                select: {
                                    id: true,
                                    chave: true,
                                    id_vencedor: true,
                                    inscricao1: {
                                        select: {
                                            id: true,
                                            classeTorneio: { select: { classeRanking: { select: { classe: { select: { nome: true } } } } } },
                                            tenista1: { select: { tenista: { select: { nome: true} } } },
                                            tenista2: { select: { tenista: { select: { nome: true} } } }
                                        }
                                    },
                                    inscricao2: {
                                        select: {
                                            id: true,
                                            classeTorneio: { select: { classeRanking: { select: { classe: { select: { nome: true } } } } } },
                                            tenista1: { select: { tenista: { select: { nome: true} } } },
                                            tenista2: { select: { tenista: { select: { nome: true} } } }
                                        }
                                    },
                                }
                            });
                        }

                        // Deleta os sets da partida atualizada
                        const setsDeleta = await prisma.sets.deleteMany({
                            where: {
                                id_partida: novaPartidaExiste.id
                            }
                        });


                        // Adiciona a partida atualizada na resposta
                        partidasAtualizadas.push({ id: novaPartidaExiste.id, sets: [], id_vencedor: novaPartidaExiste.id_vencedor });
                        
                    }else{

                        // Verifica qual jogador será adicionado na nova partida
                        if( Number(partida.chave.substring(3, 5)) % 2 === 1){
                            novaPartida = await prisma.partidas.create({
                                data: {
                                    chave: novaChave,
                                    id_inscricao: id_vencedor === -1 ? null : id_vencedor
                                },
                                select: {
                                    id: true,
                                    chave: true,
                                    id_vencedor: true,
                                    inscricao1: {
                                        select: {
                                            id: true,
                                            classeTorneio: { select: { classeRanking: { select: { classe: { select: { nome: true } } } } } },
                                            tenista1: { select: { tenista: { select: { nome: true} } } },
                                            tenista2: { select: { tenista: { select: { nome: true} } } }
                                        }
                                    },
                                    inscricao2: {
                                        select: {
                                            id: true,
                                            classeTorneio: { select: { classeRanking: { select: { classe: { select: { nome: true } } } } } },
                                            tenista1: { select: { tenista: { select: { nome: true} } } },
                                            tenista2: { select: { tenista: { select: { nome: true} } } }
                                        }
                                    },
                                }
                            });

                        }else if( Number(partida.chave.substring(3, 5)) % 2 === 0){
                            novaPartida = await prisma.partidas.create({
                                data: {
                                    chave: novaChave,
                                    id_inscricao2: id_vencedor === -1 ? null : id_vencedor
                                },
                                select: {
                                    id: true,
                                    chave: true,
                                    id_vencedor: true,
                                    inscricao1: {
                                        select: {
                                            id: true,
                                            classeTorneio: { select: { classeRanking: { select: { classe: { select: { nome: true } } } } } },
                                            tenista1: { select: { tenista: { select: { nome: true} } } },
                                            tenista2: { select: { tenista: { select: { nome: true} } } }
                                        }
                                    },
                                    inscricao2: {
                                        select: {
                                            id: true,
                                            classeTorneio: { select: { classeRanking: { select: { classe: { select: { nome: true } } } } } },
                                            tenista1: { select: { tenista: { select: { nome: true} } } },
                                            tenista2: { select: { tenista: { select: { nome: true} } } }
                                        }
                                    },
                                }
                            });
                        }


                        // Adiciona a nova partida na resposta
                        if(novaPartida)
                            novasPartidas.push({
                                id: novaPartida.id,
                                chave: novaPartida.chave,
                                classe: novaPartida.inscricao1?.classeTorneio.classeRanking.classe.nome || novaPartida.inscricao2?.classeTorneio.classeRanking.classe.nome || "",
                                id_vencedor: novaPartida.id_vencedor || -1,
                                inscricao1: novaPartida.inscricao1 ? {
                                    id: novaPartida.inscricao1.id,
                                    tenista1: novaPartida.inscricao1.tenista1.tenista.nome,
                                    tenista2: novaPartida.inscricao1.tenista2?.tenista.nome || undefined
                                } : null,
                                inscricao2: novaPartida.inscricao2 ? {
                                    id: novaPartida.inscricao2.id,
                                    tenista1: novaPartida.inscricao2.tenista1.tenista.nome,
                                    tenista2: novaPartida.inscricao2.tenista2?.tenista.nome || undefined
                                } : null,
                                sets: []
                            });

                    }
                }
            }
        }

        console.log("Partidas atualizadas: ", partidasAtualizadas.length);
        console.log("Partidas não atualizadas: ", partidasNaoAtualizadas.length);
        console.log("Novas partidas: ", novasPartidas.length);
        


        return { partidasAtualizadas, partidasNaoAtualizadas, novasPartidas };
    }
}

