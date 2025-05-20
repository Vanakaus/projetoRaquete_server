import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";
import { AtualizarPlacarDTO, partidaPlacarDTO, partidaPlacarRespostaDTO } from "../../interface/ChavesDTO";
import formataNumero from "../../functions/formatarNumero";



export class AtualizarPlacarUseCase{
    async execute({ id_torneio, novosPlacares }: AtualizarPlacarDTO): Promise<any>{

        console.log("\nResposta: ");

        const torneioExiste = await prisma.torneios.findUnique({
            where: { id: id_torneio },
            select: { id_status: true }
        });

        if(!torneioExiste)
            throw new AppError("Torneio não encontrado", 404);

        if(torneioExiste.id_status >= Number(process.env.STATUS_FINALIZADO))
            throw new AppError("Torneio já finalizado", 400);

        // Variaveis para armazenar as partidas atualizadas e não atualizadas na resposta
        const partidasAtualizadas = [] as partidaPlacarRespostaDTO[];
        const partidasNaoAtualizadas = [] as partidaPlacarDTO[];
        const novasPartidas = [] as partidaPlacarRespostaDTO[];

        // Percorre todas as partidas
        for(const novoPlacar of novosPlacares){

            // Verifica se a partida é válida
            const partida = await prisma.partidas.findUnique({
                where: {
                    id: novoPlacar.id
                },
                select: {
                    chave: true,
                    classeTorneio: {
                        select: {
                            id: true,
                            classeRanking: { select: { classe: { select: { sigla: true } } } }
                        }
                    },
                    inscricaoPartida: { select: { inscricao: { select: { id: true } } }, orderBy: { ordem: "asc" } }
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
                        id_vencedor = partida.inscricaoPartida[0].inscricao.id || -1;
                    else if(id_vencedor < 0)
                        id_vencedor = partida.inscricaoPartida[1].inscricao.id || -1;
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
                    
                    partidasAtualizadas.push({ ...novoPlacar, id_vencedor, chave: partida.chave, classe: partida.classeTorneio.classeRanking.classe.sigla || "", inscricao1: null, inscricao2: null });


                    // Verifica se a partida é a final, ou tera uma próxima partida
                    if(partida.chave === "02:01")
                        break;



                    // Atualiza ou cria a próxima partida
                    const novaChave = formataNumero( Number(partida.chave.substring(0, 2)) / 2 ) + ":" + formataNumero( Math.ceil(Number(partida.chave.substring(3, 5)) / 2) );
                    let novaPartida = null;


                    // Verifica se a próxima partida já existe
                    const novaPartidaExiste = await prisma.partidas.findFirst({
                        where: {
                            classeTorneio: { id: partida.classeTorneio.id },
                            chave: novaChave
                        },
                        select: { id: true }
                    });

                    // Variavel para verificar qual jogador será atualizado
                    let jogador = 0;

                    if(novaPartidaExiste){

                        // Verifica qual o jogador que será atualizado
                        if(Number(partida.chave.substring(3, 5)) % 2 === 1)
                            jogador = 1;
                        else if(Number(partida.chave.substring(3, 5)) % 2 === 0)
                            jogador = 2;



                        // Atualiza a inscrição do jogador na partida
                        const inscricao = await prisma.inscricaoPartida.findFirst({
                            where: {
                                id_partida: novaPartidaExiste.id,
                                ordem: jogador
                            }
                        });

                        if(!inscricao){
                            if(id_vencedor !== -1)
                                await prisma.inscricaoPartida.create({
                                    data: {
                                        id_partida: novaPartidaExiste.id,
                                        id_inscricao: id_vencedor,
                                        ordem: jogador
                                    }
                                });
                        }else{
                            if(id_vencedor !== -1)
                                await prisma.inscricaoPartida.update({
                                    where: {
                                        id: inscricao.id
                                    },
                                    data: {
                                        id_inscricao: id_vencedor
                                    }
                                });
                            else
                                await prisma.inscricaoPartida.delete({
                                    where: {
                                        id: inscricao.id
                                    }
                                });
                        }


                        // Atualiza a partida
                        novaPartida = await prisma.partidas.update({
                            where: {
                                id: novaPartidaExiste.id
                            },
                            data: {
                                id_vencedor: -1
                            },
                            select: {
                                id: true,
                                chave: true,
                                id_vencedor: true,
                                classeTorneio: { select: { classeRanking: { select: { classe: { select: { sigla: true } } } } } },
                                inscricaoPartida: {
                                    select: {
                                        ordem: true,
                                        inscricao: {
                                            select: {
                                                id: true,
                                                tenistasInscricao: { select: { tenistaAcademia: { select: { tenista: { select: { nome: true } } } } } }
                                            }
                                        }
                                    },
                                    orderBy: { ordem: "asc" }
                                },
                            }
                        });


                        // Deleta os sets da partida atualizada
                        const setsDeleta = await prisma.sets.deleteMany({
                            where: {
                                id_partida: novaPartidaExiste.id
                            }
                        });


                        // Adiciona a partida atualizada na resposta
                        partidasAtualizadas.push({ id: novaPartida.id, sets: [], id_vencedor: novaPartida.id_vencedor,
                            chave: novaPartida.chave,
                            classe: novaPartida?.classeTorneio.classeRanking.classe.sigla || "",
                            inscricao1: novaPartida?.inscricaoPartida[0]?.ordem === 1 ? {
                                id: novaPartida.inscricaoPartida[0].inscricao.id,
                                tenista1: novaPartida.inscricaoPartida[0].inscricao.tenistasInscricao[0].tenistaAcademia.tenista.nome || "",
                                tenista2: novaPartida.inscricaoPartida[0].inscricao.tenistasInscricao[1]?.tenistaAcademia.tenista.nome || undefined
                            } : null,
                            inscricao2: novaPartida?.inscricaoPartida[1]?.ordem === 2 ? {
                                id: novaPartida.inscricaoPartida[1].inscricao.id,
                                tenista1: novaPartida.inscricaoPartida[1].inscricao.tenistasInscricao[0].tenistaAcademia.tenista.nome || "",
                                tenista2: novaPartida.inscricaoPartida[1].inscricao.tenistasInscricao[1]?.tenistaAcademia.tenista.nome || undefined
                            } : 
                            novaPartida?.inscricaoPartida[0]?.ordem === 2 ? {
                                id: novaPartida.inscricaoPartida[0].inscricao.id,
                                tenista1: novaPartida.inscricaoPartida[0].inscricao.tenistasInscricao[0].tenistaAcademia.tenista.nome || "",
                                tenista2: novaPartida.inscricaoPartida[0].inscricao.tenistasInscricao[1]?.tenistaAcademia.tenista.nome || undefined
                            } : null
                         });
                        
                    }else if(id_vencedor !== -1){

                        // Verifica qual jogador será adicionado na nova partida
                        if( Number(partida.chave.substring(3, 5)) % 2 === 1)
                            jogador = 1;
                        else if( Number(partida.chave.substring(3, 5)) % 2 === 0)
                            jogador = 2;


                        novaPartida = await prisma.partidas.create({
                            data: {
                                chave: novaChave,
                                id_classeTorneio: partida.classeTorneio.id,
                                inscricaoPartida: {
                                    create: {
                                        ordem: jogador,
                                        inscricao: { connect: { id: id_vencedor } }
                                    }
                                }
                            },
                            select: {
                                id: true,
                                chave: true,
                                id_vencedor: true,
                                classeTorneio: { select: { classeRanking: { select: { classe: { select: { sigla: true } } } } } },
                                inscricaoPartida: {
                                    select: {
                                        ordem: true,
                                        inscricao: {
                                            select: {
                                                id: true,
                                                tenistasInscricao: { select: { tenistaAcademia: { select: { tenista: { select: { nome: true } } } } } }
                                            }
                                        }
                                    }
                                }
                            }
                        });

                        // Adiciona a nova partida na resposta
                        if(novaPartida)
                            novasPartidas.push({
                                id: novaPartida.id,
                                chave: novaPartida.chave,
                                classe: novaPartida.classeTorneio.classeRanking.classe.sigla || "",
                                id_vencedor: novaPartida.id_vencedor || -1,
                                inscricao1: novaPartida.inscricaoPartida[0].ordem === 1 ? {
                                    id: novaPartida.inscricaoPartida[0].inscricao.id,
                                    tenista1: novaPartida.inscricaoPartida[0].inscricao.tenistasInscricao[0].tenistaAcademia.tenista.nome,
                                    tenista2: novaPartida.inscricaoPartida[0].inscricao.tenistasInscricao[1]?.tenistaAcademia.tenista.nome || undefined
                                } : null,
                                inscricao2: novaPartida.inscricaoPartida[1]?.ordem === 2 ? {
                                    id: novaPartida.inscricaoPartida[1].inscricao.id,
                                    tenista1: novaPartida.inscricaoPartida[1].inscricao.tenistasInscricao[0].tenistaAcademia.tenista.nome,
                                    tenista2: novaPartida.inscricaoPartida[1].inscricao.tenistasInscricao[1]?.tenistaAcademia.tenista.nome || undefined
                                } : 
                                novaPartida.inscricaoPartida[0].ordem === 2 ? {
                                    id: novaPartida.inscricaoPartida[0].inscricao.id,
                                    tenista1: novaPartida.inscricaoPartida[0].inscricao.tenistasInscricao[0].tenistaAcademia.tenista.nome,
                                    tenista2: novaPartida.inscricaoPartida[0].inscricao.tenistasInscricao[1]?.tenistaAcademia.tenista.nome || undefined
                                } : null,
                                sets: []
                            });

                    }
                }
            }
        }


        // Verifica se o torneio foi finalizado
        let finalizado = true;
        const classeTorneio = await prisma.classeTorneio.findMany({
            where: {
                id_torneio: id_torneio
            },
            select: {
                inscricao: {
                    where: { inscricaoPartida: { some: { partida: { chave: "02:01" } } } },
                    select: {
                        inscricaoPartida: {
                            where: { partida: { chave: "02:01" } },
                            select: {
                                partida: {
                                    select: { id_vencedor: true }
                                }
                            }
                        }
                    }
                }
            }
        });


        // Passa por todas as classes do torneio
        for(const classe of classeTorneio){

            // Se não tiver inscrições na partida final, o torneio não foi finalizado
            if(classe.inscricao.length !== 2){
                finalizado = false;
                break;
            }

            // Verifica se a partida foi finalizada, possui um vencedor
            if(classe.inscricao[1].inscricaoPartida[0].partida.id_vencedor === -1){
                finalizado = false;
                break;
            }
        }



        // Atualiza o status do torneio, de acordo com o resultado
        const torneio = await prisma.torneios.update({
            where: { id: id_torneio },
            data: { id_status: (finalizado ? Number(process.env.STATUS_JOGOS_FINALIZADOS) : Number(process.env.STATUS_EM_ANDAMENTO)) },
            select: {
                id: true,
                nome: true,
                status: { select: { id: true, nome: true } }
            }
        });


        console.log("Partidas atualizadas: ", partidasAtualizadas.length);
        console.log("Partidas não atualizadas: ", partidasNaoAtualizadas.length);
        console.log("Novas partidas: ", novasPartidas.length);
        console.log("Torneio: ", torneio);
        


        return { torneio, partidasAtualizadas, partidasNaoAtualizadas, novasPartidas };
    }
}

