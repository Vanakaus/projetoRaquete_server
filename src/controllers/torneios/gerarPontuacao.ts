import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";
import { GerarPontuacaoDTO } from "../../interface/TorneiosDTO";


export class GerarPontuacaoUseCase{
    async execute({ id_torneio }: GerarPontuacaoDTO): Promise<any>{

        console.log("\nResposta: ");

        // Lista a pontuacao do torneio
        const pontuacoes = await prisma.pontuacoesTorneio.findFirst({
            where: { torneios: { id: id_torneio } }
        });

        if (!pontuacoes) {
            console.log("Pontuação não encontrada");
            throw new AppError('Pontuação não encontrada');
        }



        // Lista todas as partidas agrupando por classeTorneio e ordenadas por chave
        const classes = await prisma.classeTorneio.findMany({
            where: { id_torneio: id_torneio },
            select: {
                id: true,
                classeRanking: {
                    select: {
                        classe: {
                            select: {
                                nome: true,
                                 sigla: true,
                                 masculino: true,
                                 misto: true,
                                 dupla: true,
                            }
                        }
                    }
                },
            },
        }) as any;

        

        // Percorre as classes adicionando os resultados
        for (const classe of classes) {

            // Cria o array dos resultados
            classe.pontuacao = [] as { posicao: string, pontuacao: number, inscricao: { id: number, tenista1: string, tenista2: string | undefined } }[];

            // Lista todas as partidas da classe
            const listaPartidas = await prisma.partidas.findMany({
                where: {
                    inscricaoPartida: { some: { inscricao: { id_classeTorneio: classe.id } } }
                },
                select: {
                    chave: true,
                    id_vencedor: true,
                    inscricaoPartida: { select: { inscricao: { select: { id: true, tenistasInscricao: { select: { tenistaAcademia: { select: { tenista: { select: { nome: true } } } } } } } } } },
                },
                orderBy: { chave: 'asc' }
            });

            // Pega a chave do roubo externo
            const ultimaChave = listaPartidas[listaPartidas.length - 1].chave.substring(0, 3);

            // Percorre as partidas verificando a posição e adicionando os resultados
            for (const partida of listaPartidas) {
                let pontuacao = 0;
                let posicao = '';

                // Verifica a posição alcançada
                if (partida.chave.includes("02:")){
                    pontuacao = pontuacoes?.r2;
                    posicao = 'R2';
                }else if (partida.chave.includes("04:")){
                    pontuacao = pontuacoes?.r4;
                    posicao = 'R4';
                }else if (partida.chave.includes("08:")){
                    pontuacao = pontuacoes?.r8;
                    posicao = 'R8';
                }else if (partida.chave.includes("16:")){
                    pontuacao = pontuacoes?.r16;
                    posicao = 'R16';
                }else if (partida.chave.includes("32:")){
                    pontuacao = pontuacoes?.r32;
                    posicao = 'R32';
                }else if (partida.chave.includes("64:")){
                    pontuacao = pontuacoes?.r64;
                    posicao = 'R64';
                }

                // Verifica se é a chave do round externo
                if (partida.chave.substring(0, 3) === ultimaChave) {
                    posicao = 'P';
                    pontuacao = pontuacoes?.participacao;
                }
                

                // Verifica se é a chave da final do torneio
                if(partida.chave.includes("02:")){
                    if(partida.inscricaoPartida[0].inscricao.id === partida.id_vencedor){
                        classe.pontuacao.push({
                            posicao,
                            pontuacao: pontuacoes.vencedor,
                            inscricao: {
                                id: partida.inscricaoPartida[0].inscricao.id,
                                tenista1: partida.inscricaoPartida[0].inscricao.tenistasInscricao[0].tenistaAcademia.tenista.nome,
                                tenista2: partida.inscricaoPartida[0].inscricao.tenistasInscricao[1]?.tenistaAcademia.tenista.nome
                            }
                        });
                    }else{
                        classe.pontuacao.push({
                            posicao,
                            pontuacao: pontuacoes.vencedor,
                            inscricao: {
                                id: partida.inscricaoPartida[1].inscricao.id,
                                tenista1: partida.inscricaoPartida[1].inscricao.tenistasInscricao[0].tenistaAcademia.tenista.nome,
                                tenista2: partida.inscricaoPartida[1].inscricao.tenistasInscricao[1]?.tenistaAcademia.tenista.nome
                            }
                        });
                    }
                }


                // Verifica se é a chave de uma partida normal
                if(partida.id_vencedor !== -1)
                    
                    // Verifica qual jogador parou neste round
                    if(partida.inscricaoPartida[0].inscricao.id !== partida.id_vencedor)
                        classe.pontuacao.push({
                            posicao,
                            pontuacao,
                            inscricao: {
                                id: partida.inscricaoPartida[0].inscricao.id,
                                tenista1: partida.inscricaoPartida[0].inscricao.tenistasInscricao[0].tenistaAcademia.tenista.nome,
                                tenista2: partida.inscricaoPartida[0].inscricao.tenistasInscricao[1]?.tenistaAcademia.tenista.nome
                            }
                        });
                    else
                        classe.pontuacao.push({
                            posicao,
                            pontuacao,
                            inscricao: {
                                id: partida.inscricaoPartida[1].inscricao.id,
                                tenista1: partida.inscricaoPartida[1].inscricao.tenistasInscricao[0].tenistaAcademia.tenista.nome,
                                tenista2: partida.inscricaoPartida[1].inscricao.tenistasInscricao[1]?.tenistaAcademia.tenista.nome
                            }
                        });
                    
                else{

                    // Adiciona a pontuação de participação para os jogadores que não ganharam nenhuma partida
                    const posicaoSeguinte = Number(partida.chave.split(":")[0]) / 2;
                    const resultado = classe.pontuacao.find((r: any) => r.inscricao.id === partida.inscricaoPartida[0].inscricao.id);
                    if (resultado.posicao === `R${posicaoSeguinte}`) {
                        resultado.posicao = 'P';
                        resultado.pontuacao = pontuacoes.participacao;
                    }

                }

            }

            // Reordena os resultados por pontuaçã. necessário os resultados de participação
            classe.pontuacao.sort((a: any, b: any) => {
                if (a.pontuacao > b.pontuacao) return -1;
                if (a.pontuacao < b.pontuacao) return 1;
                return 0;
            });
        }


        return {  resultados: classes };
    }
}