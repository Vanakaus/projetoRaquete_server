import { RankingDTO } from "../../interface/RankingDTO";
import { prisma } from "../../prisma/client";



export class RankingUseCase{
    async execute( { id_classeRanking }: RankingDTO ): Promise<any>{

        // Calcula a faixa de datas para buscar as pontuações dos tenistas
        const anoAtual = new Date().getFullYear();
        const inicioAno = new Date(anoAtual, 0, 1);
        const fimAno = new Date(anoAtual, 11, 31);

        
        // Lista todos os tenistas que já se inscreveram em torneios da classe de ranking
        // Trazendo todas as pontuações de cada tenista no ano escolhido
        const ranking = await prisma.tenistasAcademias.findMany({
            where: { OR: [
                { Inscricao1: { some: { classeTorneio: { classeRanking: { id: id_classeRanking } } } } },
                { Inscricao2: { some: { classeTorneio: { classeRanking: { id: id_classeRanking } } } } },
            ] },
            select: {
                id: true,
                tenista: {
                    select: {
                        cpf: true,
                        nome: true
                    }
                },
                Inscricao1: { select: { pontuacaoRanking: true }, where: { pontuacaoRanking: { AND: [ { data: { gte: inicioAno } }, { data: { lte: fimAno } } ] } } },
                Inscricao2: { select: { pontuacaoRanking: true }, where: { pontuacaoRanking: { AND: [ { data: { gte: inicioAno } }, { data: { lte: fimAno } } ] } } },
            }
        }) as any;



        // Percorre a lista de tenistas e calcula a pontuação de cada um
        for(const pessoa of ranking){

            // Calcula a pontuação de cada tenista
            pessoa.pontuacao = pessoa.Inscricao1.reduce((acc: number, inscricao: any) => acc + inscricao.pontuacaoRanking.pontuacao, 0) + pessoa.Inscricao2.reduce((acc: number, inscricao: any) => acc + inscricao.pontuacaoRanking.pontuacao, 0);
            
            // Deleta os campos Inscricao1 e Inscricao2 para não poluir o JSON de resposta
            delete pessoa.Inscricao1;
            delete pessoa.Inscricao2;
        }


        ranking.sort((a: any, b: any) => b.pontuacao - a.pontuacao);
        console.log(`Ranking listado com sucesso. ${ranking.length} tenistas listados`);

        return { ranking };
    }
}