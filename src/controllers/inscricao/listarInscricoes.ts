import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";
import { ListaInscricoesDTO } from "../../interface/InscricaoUsersDTO";



export class ListarInscricoesUseCase{
    async execute({ id_torneio}: ListaInscricoesDTO): Promise<any>{

        // Verifica se o torneio existe e sua data de inicio
        const torneio = await prisma.torneios.findUnique({
            where: { id: id_torneio },
            select: {
                status: true,
                dataInicio: true
            }
        });

        if(!torneio){
            console.log("Torneio não encontrado");
            throw new AppError('Torneio não encontrado');
        }
        
        
        // Busca todos os incritos no torneio agrupando por classeTorneio
        const classeInscricoes = await prisma.classeTorneio.findMany({
            select: {
                classeRanking: { 
                    select: {
                        id: true,
                        classe: { select: { sigla: true } }
                    }
                },
                inscricao: {
                    select: {
                        tenistasInscricao: {
                            select: {
                                tenistaAcademia: {
                                    select: {
                                        id:true,
                                        tenista: { select: { nome: true } }
                                    }
                                }
                            }
                        }
                    }
                },
            },
            where: { id_torneio }
        }) as any;



        console.log("\nResposta: ");

        if(!classeInscricoes){
            console.log("Sem inscrições no torneio");
            console.log(classeInscricoes);
            throw new AppError('Sem inscrições no torneio\n\n\n' + classeInscricoes);
            
        }


        // Cria as variaves de intervalo de datas para buscar as pontuações dos tenistas
        let anoAtual = torneio.dataInicio.getFullYear();
        let inicioAno;
        let fimAno;

        // Busca a pontuacao de cada inscrito com base na classe inscrita e no ano corrente, ou no ano passado caso ainda nao haja resultados este ano
        for(const classeInscricao of classeInscricoes){

            inicioAno = new Date(anoAtual, 0, 1);

            // Verifica se já houve algum torneio neste ano para esta classe
            const resultado = await prisma.pontuacaoRanking.findFirst({
                where: {
                    data: { gte: inicioAno, lte: torneio.dataInicio },
                    inscricao: { classeTorneio: { id_classeRanking: classeInscricao.classeRanking.id } }
                }
            });

            if(resultado){
                fimAno = torneio.dataInicio;
            } else{
                inicioAno = new Date(anoAtual-1, 0, 1);
                fimAno = new Date(anoAtual-1, 11, 31);
            }



            // Busca e adiciona a pontuação de cada inscrito
            for(const inscricao of classeInscricao.inscricao){

                let pontuacao = 0;

                // Percorre os tenistas da inscrição e busca a pontuação de cada um
                for(const tenistaInscricao of inscricao.tenistasInscricao){
                    const pontuacoes = await prisma.pontuacaoRanking.findMany({
                        where: {
                            inscricao: {
                                tenistasInscricao: { some: { tenistaAcademia: { id: tenistaInscricao.tenistaAcademia.id } } },
                                classeTorneio: { id_classeRanking: classeInscricao.classeRanking.id }
                            },
                            data: { gte: inicioAno, lte: fimAno }
                        },
                        select: { pontuacao: true }
                    });

                    // Soma a pontuação de cada tenista
                    pontuacao += pontuacoes.reduce((acc: number, pontuacao: any) => acc + pontuacao.pontuacao, 0);
                }
                // Adiciona a pontuação dos tenistas na inscrição
                inscricao.pontuacao = pontuacao;
            }
        }



        console.log("Inscrições listadas: " + classeInscricoes.reduce((acc: number, inscricao: any) => acc + inscricao.inscricao.length, 0));
        

        return {classeInscricoes};
    }
}