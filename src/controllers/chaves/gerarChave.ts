import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";
import { GerarChaveDTO } from "../../interface/ChavesDTO";
import formataNumero from "../../functions/formatarNumero";



export class GerarChaveUseCase{
    async execute({ id_torneio, id_classeTorneio, numCabecas}: GerarChaveDTO): Promise<any>{

        console.log("\nResposta: ");

        // Verifica se o torneio existe e qual seu status
        let torneio = await prisma.torneios.findUnique({
            where: {
                id: id_torneio
            },
            select: {
                status: true,
                nome: true,
            }
        }) as any;        


        if(!torneio){
            console.log("Torneio não encontrado");
            throw new AppError('Torneio inválido\n\n\n' + torneio);
        }

        if(torneio.status.id >= Number(process.env.STATUS_JOGOS_FINALIZADOS)){
            console.log("Não é possível gerar chave \nTorneio Status: " + torneio.status);
            throw new AppError('Não é possível gerar chave. Torneio Status: ' + torneio.status.nome);
        }



        // Verifica se a classe do torneio existe, e se possui partidas gerados
        const classe = await prisma.classeTorneio.findUnique({
            where: {
                id: id_classeTorneio
            },
            select: {
                cabecasChave: true,
                classeRanking: {
                    select: {
                        id: true,
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



        // Verifica se o número de cabeças de chave é um valor válido
        if(numCabecas !== 0 && numCabecas !== 2 && numCabecas !==   4){
            console.log("Número de cabeças de chave inválido");
            throw new AppError('Número de cabeças de chave inválido');
        }



        // Busca todos os incritos no Torneio
        const inscricoes = await prisma.inscricao.findMany({
            select: {
                id: true,
                tenistasInscricao: {
                    select: {
                        id_tenistaAcademia: true,
                        tenistaAcademia: { select: { tenista: { select: { nome: true } } } },
                    }
                }
            },
            where: {
                id_classeTorneio
            }
        }) as any[];



        // Calcula qual o tamanho da chave
        let numInscritos = inscricoes.length;
        let roundStr = '00:';
        let roundInt = 0;

        if(numInscritos < 3){
            roundInt = 1;
            roundStr = '01:';
        }else if(numInscritos < 5){
            roundInt = 2;
            roundStr = '02:';
        }else if(numInscritos < 9){
            roundInt = 4;
            roundStr = '04:';
        }else if(numInscritos < 17){
            roundInt = 8;
            roundStr = '08:';
        }else if(numInscritos < 33){
            roundInt = 16;
            roundStr = '16:';
        }else if(numInscritos < 65){
            roundInt = 32;
            roundStr = '32:';
        }



        // Verifica se o número de cabeças de chave é compatível com o número de inscritos (numCabecas <= roundInt)
        if(numCabecas > roundInt){
            console.log("Número de cabeças de chave maior que o número de inscritos");
            throw new AppError('Número de cabeças é incompatível com a quantidade de inscritos');
        }


        
        // Calcula a faixa inicial da data para buscar as pontuações dos tenistas
        let inicioAno = new Date(new Date().getFullYear(), 0, 1);



        // Verifica se já houve algum torneio neste ano
        const resultado = await prisma.pontuacaoRanking.findFirst({
            where: {
                data: { gte: inicioAno },
                inscricao: { classeTorneio: { id_classeRanking: classe.classeRanking.id } }
            }
        });

        if(!resultado)
            inicioAno = new Date(inicioAno.getFullYear()-1, 0, 1);



        // Adiciona a pontuacao de cada jogador
        for(let i = 0; i < inscricoes.length; i++){

            // Soma a pontuação do primeiro tenista
            let pontuacao = await prisma.pontuacaoRanking.aggregate({
                where: {
                    inscricao: {
                        tenistasInscricao: { some: {id_tenistaAcademia: inscricoes[i].tenistasInscricao[0].id_tenistaAcademia } },
                        classeTorneio: { classeRanking: { id: classe.classeRanking.id } }
                    },
                    data: { gte: inicioAno, lte: new Date() },
                },
                _sum: {
                    pontuacao: true
                }
            });

            // Adiciona a pontuação e exclui o id do tenista
            inscricoes[i].pontuacao = pontuacao._sum.pontuacao || 0;
            delete inscricoes[i].tenistasInscricao[0].id_tenistaAcademia;


            // Caso seja uma dupla, soma a pontuação do segundo tenista
            if(classe.classeRanking.classe.dupla){

                pontuacao = await prisma.pontuacaoRanking.aggregate({
                    where: {
                        inscricao: {
                            tenistasInscricao: { some: {id_tenistaAcademia: inscricoes[i].tenistasInscricao[1].id_tenistaAcademia } },
                            classeTorneio: { classeRanking: { id: classe.classeRanking.id } }
                        },
                        data: { gte: inicioAno, lte: new Date() },
                    },
                    _sum: {
                        pontuacao: true
                    }
                });

                // Adiciona a pontuação e exclui o id do tenista
                inscricoes[i].pontuacao += pontuacao._sum.pontuacao || 0;
                delete inscricoes[i].tenistasInscricao[1].id_tenistaAcademia;
            }
        }


        
        // Ordena os inscritos por pontuação
        inscricoes.sort((a: { pontuacao: number; }, b: { pontuacao: number; }) => {
            return b.pontuacao - a.pontuacao;
        });

        

        // Manter os cabecas de chave em ordem e embaralhar os demais jogadores
        const demaisJogadores = inscricoes.slice(numCabecas).sort(() => Math.random() - 0.5);

        // Substitui os demais jogadores em ordem pela ordem aleatória
        inscricoes.splice(numCabecas, demaisJogadores.length, ...demaisJogadores);



        // Cria e alimenta o array de partidas com a estrutura { chave, inscricoes }
        // Utiliza 3 loops para alimentar o array de partidas, um para os cabecas de chave, um para os mandantes e um para os oponentes
        const partidas = [];
        const chaves = [];
        let j=numCabecas;


        // Loop para os cabeças de chave
        for(let i = 0; i < numCabecas; i++){
            switch (i){
                case 0: chaves.push(1); break;
                case 1: chaves.push(roundInt); break;
                case 2: chaves.push(roundInt/2); break;
                case 3: chaves.push((roundInt/2)+1); break;
            }

            partidas.push({ id: -1, chave: roundStr + formataNumero(chaves[i]), inscricoes: [{...inscricoes[i], ordem: 1}] });
        }


        // Loop para os demais mandantes
        for(let i = 1; i <= roundInt; i++){

            if(chaves.includes(i)) continue;

            chaves.push(i);
            partidas.push({ id: -1, chave: roundStr + formataNumero(i), inscricoes: [{...inscricoes[j++], ordem: 1}] });
        }


        // Loop para os oponentes
        for(let i = partidas.length-1; i >= 0 && j < inscricoes.length; i--){
            partidas[i].inscricoes.push({...inscricoes[j++], ordem: 2});
        }


        // Verifica se há e adiciona as partidas resultantes de confrontos com BYEs
        roundStr = formataNumero(roundInt / 2) + ":";
        const partidasLength = partidas.length;

        for(let i = 0; i < partidasLength; i++){

            // Verifica se o jogo tem apenas um inscrito (BYE)
            if(partidas[i].inscricoes.length !== 1) continue;

            const novaChave = roundStr + formataNumero(Math.round(chaves[i] / 2));
            
            const index = partidas.findIndex(jogo => jogo.chave === novaChave);
            if(index === -1){
                partidas.push({
                    id: -1,
                    chave: novaChave,
                    inscricoes: [
                        {...partidas[i].inscricoes[0], ordem: chaves[i] % 2 === 1 ? 1 : 2}
                    ]
                });
            }
            else
                partidas[index].inscricoes.push({...partidas[i].inscricoes[0], ordem: chaves[i] % 2 === 1 ? 1 : 2});
        }



        // Cria as partidas no banco de dados
        for( const jogo of partidas){

            // Cria a partida
            const partida = await prisma.partidas.create({
                data: {
                    chave: jogo.chave
                }
            });

            jogo.id = partida.id;

            // Cria a conexão entre a partida e as inscrições
            for(const inscricao of jogo.inscricoes){
                if(!inscricao) continue;
                
                await prisma.inscricaoPartida.create({
                    data: {
                        id_partida: partida.id,
                        id_inscricao: inscricao.id,
                        ordem: inscricao.ordem,
                    }
                });
            }
        }

        
        
        // Atualiza a classe do torneio para informar que as chaves foram geradas com o número de cabeças de chave
        const classeTorneio = await prisma.classeTorneio.update({
            where: {
                id: id_classeTorneio
            },
            data: {
                cabecasChave: numCabecas
            }
        });
        
        
        console.log("\n\nPartidas geradas com sucesso: ", partidas.length);



        // Verifica se há classes sem partidas gerados
        const torneioClasseEmBranco = await prisma.classeTorneio.findFirst({
            where: {
                id_torneio: id_torneio,
                cabecasChave: -1
            }
        });



        // Se não houver classes sem partidas geradas, atualiza o status do torneio para "Inscrições Encerradas"
        if(!torneioClasseEmBranco){
            torneio = await prisma.torneios.update({
                where: {
                    id: id_torneio
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
