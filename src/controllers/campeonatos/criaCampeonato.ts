import { User } from "@prisma/client";
import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";
import { CriaTorneioDTO } from "../../interface/CampeonatoUsersDTO";



export class CriaCampeonatoUseCase{
    async execute({ id_academia, idRanking, nome, descricao = "", local = "", sets, tiebreak, modalidade, pontuacao, classes, dataInicio, dataFim}: CriaTorneioDTO): Promise<User>{

        console.log("CriaCampeonatoUseCase");
        console.log({ id_academia, idRanking, nome, descricao, local, sets, tiebreak, modalidade, pontuacao, classes, dataInicio, dataFim});


        console.log("\nResposta: ");

        // Verifica se o torneio já existe
        const torneioExiste = await prisma.torneios.findFirst({
            where: {
                id_academia,
                nome
            }
        });


        if(torneioExiste){
            console.log("Nome de torneio indisponível");
            throw new AppError('Nome de torneio indisponível');
        }



        // Verifica se o ranking existe
        const rankingExiste = await prisma.ranking.findFirst({
            where: {
                id_academia,
                id: idRanking
            }
        });

        if(!rankingExiste){
            console.log("Erro ao sincronizar ranking");
            throw new AppError('Erro ao sincronizar ranking');
        }



        // Verifica se as classes existem e as adiciona ao ranking, salvando o id da classeRanking para adicionar ao torneio
        const classeRanking: number[] = [];
        for (let i = 0; i < classes.length; i++) {
            let classeExiste = await prisma.classeRanking.findFirst({
                where: {
                    id_classe: classes[i],
                }
            }) as any;


            if(!classeExiste){
                classeExiste = await prisma.classes.findFirst({
                    where: {
                        id: classes[i]
                    }
                });

                if(!classeExiste){
                    console.log("Classe não encontrada");
                    throw new AppError('Classe não encontrada');
                }

                const novaClasse = await prisma.classeRanking.create({
                    data: {
                        id_classe: classes[i],
                        id_ranking: idRanking
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



        // Acha o status inicial
        const status = await prisma.status.findFirst({});

        if(!status){
            console.log("Erro ao encontrar status inicial");
            throw new AppError('Erro ao encontrar status inicial');
        }


        // Adiciona as pontuações
        const pontuacaoCampeonato = await prisma.pontuacoesCampeonato.create({
            data: {
                ...pontuacao
            }
        });


        
        // Cria o torneio
        dataInicio = new Date(dataInicio);
        dataFim = new Date(dataFim);
        
        const torneio = await prisma.torneios.create({
            data: {
                id_academia,
                id_pontuacoes: pontuacaoCampeonato.id,
                id_status: status.id,
                nome,
                descricao,
                local,
                sets,
                tiebreak,
                simples: modalidade.simples,
                duplas: modalidade.duplas,
                dataInicio,
                dataFim
            }
        }) as any;
        

        if(!torneio){
            console.log("Erro ao criar campeonato");
            console.log(torneio);
            throw new AppError('Erro ao criar campeonato\n\n\n' + torneio);
        }



        // Adiciona as classes ao torneio
        classeRanking.forEach(async (classe) => {
            await prisma.classeTorneio.create({
                data: {
                    id_classeRanking: classe,
                    id_torneio: torneio.id,
                    cabecasChave: 0
                }
            });
        });






        console.log("Campeonato criado com sucesso");
        console.log(torneio);
        

        return torneio;
    }
}