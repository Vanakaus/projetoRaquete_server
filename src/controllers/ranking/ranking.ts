import { RankingDTO } from "../../interface/RankingDTO";
import { prisma } from "../../prisma/client";



export class RankingUseCase{
    async execute( { id_classeRanking }: RankingDTO ): Promise<any>{

        // Calcula a faixa de datas para buscar as pontuações dos tenistas
        let anoAtual = new Date().getFullYear();
        let inicioAno = new Date(anoAtual, 0, 1);
        let fimAno = new Date(anoAtual, 11, 31);


        // Verifica se já houve algum torneio neste ano
        const resultado = await prisma.pontuacaoRanking.findFirst({
            where: {
                data: { gte: inicioAno},
                inscricao: { classeTorneio: { id_classeRanking } }
            }
        });

        if(!resultado){
            anoAtual--;
            inicioAno = new Date(anoAtual, 0, 1);
            fimAno = new Date(anoAtual, 11, 31);
        }


        console.log(`Buscando ranking de tenistas da classe ${id_classeRanking} do ano ${anoAtual}`);

        
        // Lista todos os tenistas que já se inscreveram em torneios da classe de ranking
        // Trazendo todas as pontuações de cada tenista no ano escolhido
        const ranking = await prisma.tenistasAcademias.findMany({
            where: {
                tenistasInscricao: { some: { inscricao: { classeTorneio: { id_classeRanking } } } },
            },
            select: {
                id: true,
                tenista: {
                    select: {
                        cpf: true,
                        nome: true
                    }
                },
                tenistasInscricao: {
                    select: {
                        inscricao: {
                            select: {
                                pontuacaoRanking: {
                                    select: {
                                        pontuacao: true,
                                        data: true
                                    },
                                }
                            }
                        }
                    },
                    where: { inscricao: { pontuacaoRanking: { data: { gte: inicioAno, lte: fimAno } } } }
                }
            }
        }) as any;



        // Percorre a lista de tenistas e calcula a pontuação de cada um
        for(const pessoa of ranking){

            // Calcula a pontuação de cada tenista
            pessoa.pontuacao = pessoa.tenistasInscricao.reduce((acc: number, inscricao: any) => acc + inscricao.inscricao.pontuacaoRanking.pontuacao, 0);
            
            // Deleta os campos TenistasInscricoes para não poluir o JSON de resposta
            delete pessoa.tenistasInscricao;
        }


        ranking.sort((a: any, b: any) => b.pontuacao - a.pontuacao);
        console.log(`Ranking listado com sucesso. ${ranking.length} tenistas listados`);

        return { ranking };
    }
}