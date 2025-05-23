import { User } from "@prisma/client";
import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";
import { AtualizarTorneioDTO } from "../../interface/TorneiosDTO";



export class AtualizarTorneioUseCase{
    async execute({ id, id_academia, nome, descricao, local, sets, pontuacao, classesDeleta, classesAdiciona, dataInicio, dataFim }: AtualizarTorneioDTO): Promise<any>{

        console.log("Atualizando campeonato: " + id);


        console.log("\nResposta: ");

        // Busca todos os campeonatos que tenham o nome do novo campeonato dentro do nome deles
        const torneioExiste = await prisma.torneios.findUnique({
            where: {
                id,
                id_academia
            },
            select: {
                sets: true,
                simples: true,
                duplas: true,
                dataInicio: true,
                dataFim: true,
                pontuacoes: {
                    select: { id: true }
                },
                status: {
                    select: { id: true }
                },
                classeTorneio: {
                    select: {
                        classeRanking: {
                            select: {
                                id_ranking: true
                            }
                        }
                    }
                }       
            }
        });

        if(!torneioExiste){
            console.log("Torneio não encontrado");
            throw new AppError('Torneio não encontrado');
        }



        // Verifica se o torneio já existe
        const nomeExiste = await prisma.torneios.findFirst({
            where: {
                AND: {
                    id_academia,
                    nome,
                    NOT: { id },
                }
            }
        });

        if(nomeExiste){
            console.log("Nome de torneio indisponível");
            throw new AppError('Nome de torneio indisponível');
        }




        // Atualiza o torneio de acordo com o status do torneio
        dataInicio = new Date(dataInicio);
        dataFim = new Date(dataFim);
        
        const torneio = await prisma.torneios.update({
            where: {
                id
            },
            data: {
                nome,
                descricao,
                local,
                sets: torneioExiste.status.id < Number(process.env.STATUS_EM_ANDAMENTO) ? sets : torneioExiste.sets,
                dataInicio: torneioExiste.status.id < Number(process.env.STATUS_EM_ANDAMENTO) ? dataInicio : torneioExiste.dataInicio,
                dataFim: torneioExiste.status.id < Number(process.env.STATUS_JOGOS_FINALIZADOS) ? dataFim : torneioExiste.dataFim,
            },
            select: {
                id: true,
                nome: true,
                descricao: true,
                local: true,
                sets: true,
                simples: true,
                duplas: true,
                dataInicio: true,
                dataFim: true,
                pontuacoes: true,
                status: true,
                classeTorneio: {
                    select: {
                        id: true,
                        classeRanking: {
                            select: {
                                id: true,
                                classe: {
                                    select: {
                                        id: true,
                                        nome: true
                                    }
                                }
                            }
                        }
                    }

                },
            }
        }) as any;
        
        if(!torneio){
            console.log("Erro ao atualizar torneio");
            console.log(torneio);
            throw new AppError('Erro ao atualizar torneio\n\n\n' + torneio);
        }



        if(torneioExiste.status.id < Number(process.env.STATUS_FINALIZADO)){
            const pontuacoes = await prisma.pontuacoesTorneio.update({
                where: {
                    id: torneioExiste.pontuacoes.id
                },
                data: {
                    participacao: pontuacao.participacao,
                    r64: pontuacao.r64,
                    r32: pontuacao.r32,
                    r16: pontuacao.r16,
                    r8: pontuacao.r8,
                    r4: pontuacao.r4,
                    r2: pontuacao.r2,
                    vencedor: pontuacao.vencedor
                }
            }) as any;

            if(!pontuacoes){
                console.log("Erro ao atualizar pontuações");
                console.log(pontuacoes);
                throw new AppError('Erro ao atualizar pontuações\n\n\n' + pontuacoes);
            }
        }




        
        if(torneioExiste.status.id < Number(process.env.STATUS_JOGOS_GERADOS)){
            //  Deleta as classes removidas ( inscrições e classesTorneio )

            await prisma.classeTorneio.deleteMany({
                where: {
                    id: {
                        in: classesDeleta
                    }
                }
            });



            // Adiciona as classes ao torneio

            // Verifica se as classes existem e as adiciona ao ranking, salvando o id da classeRanking para adicionar ao torneio
            const classeRanking: number[] = [];
            let classeExiste;
                for (let i = 0; i < classesAdiciona.length; i++) {
                classeExiste = await prisma.classeRanking.findFirst({
                    where: {
                        id_classe: classesAdiciona[i],
                        id_ranking: torneio.idRanking
                    }
                });


                if(!classeExiste){
                    classeExiste = await prisma.classes.findFirst({
                        where: {
                            id: classesAdiciona[i]
                        }
                    });

                    if(!classeExiste){
                        console.log("Classe não encontrada");
                        throw new AppError('Classe não encontrada');
                    }

                    const novaClasse = await prisma.classeRanking.create({
                        data: {
                            id_classe: classesAdiciona[i],
                            id_ranking: torneioExiste.classeTorneio[0].classeRanking.id_ranking
                        }
                    });

                    if(!novaClasse){
                        console.log("Erro ao adicionar classe ao ranking");
                        throw new AppError('Erro ao adicionar classe ao ranking');
                    }

                    classeRanking.push(novaClasse.id);
                } else {
                    classeRanking.push(classeExiste.id);
                }
            }


            // Adiciona as classes ao torneio
            for (let i = 0; i < classeRanking.length; i++) {
                await prisma.classeTorneio.create({
                    data: {
                        id_classeRanking: classeRanking[i],
                        id_torneio: torneio.id
                    }
                });
            }

        }


        // simples: torneioExiste.status.id < Number(process.env.STATUS_INSCRICOES_ENCERRADAS) ? modalidade.simples : torneioExiste.simples,
        // duplas: torneioExiste.status.id < Number(process.env.STATUS_INSCRICOES_ENCERRADAS) ? modalidade.duplas : torneioExiste.duplas,

        if(torneioExiste.status.id < Number(process.env.STATUS_INSCRICOES_ENCERRADAS)){

        const classesTorneio = await prisma.classeTorneio.findMany({
            where: {
                id_torneio: torneio.id
            },
            select: {
                classeRanking: {
                    select: {
                        classe: {
                            select: {
                                dupla: true,
                            }
                        }
                    }
                }
            }
        });

        const simples = classesTorneio.filter((classe) => classe.classeRanking.classe.dupla == false);
        const duplas = classesTorneio.filter((classe) => classe.classeRanking.classe.dupla == true);

        await prisma.torneios.update({
            where: {
                id: torneio.id
            },
            data: {
                simples: simples.length > 0 ? true : false,
                duplas: duplas.length > 0 ? true : false
            }
        });
        }


        return { torneio };
    }
}