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
        
        
        // Busca todos os incritos no torneio
        const inscricoes = await prisma.inscricao.findMany({
            select: {
                id: true,
                tenistasInscricao: {
                    select: { 
                        tenistaAcademia: {
                            select: { tenista: { select: { cpf: true, nome: true } } }
                        }
                    },
                    orderBy: { ordem: 'asc' }
                },
                classeTorneio: {
                    select: {
                        classeRanking: {
                            select: {
                                classe: {
                                    select: {
                                        sigla: true
                                    }
                                }
                            }
                        }
                    }
                }
            },
            where: { classeTorneio: { id_torneio } }
        }) as any;


        // Busca suas ultimas x pontuacoes ate a data do torneio
        for(const inscricao of inscricoes){
            let pontuacao = 0;
            for(const tenistaInscricao of inscricao.tenistasInscricao){
                const pontuacoes = await prisma.pontuacaoRanking.findMany({
                    where: {
                        inscricao: {tenistasInscricao: { some: { tenistaAcademia: { tenista: { cpf: tenistaInscricao.tenistaAcademia.tenista.cpf } } } } },
                        data: { lte: torneio.dataInicio }
                    },
                    select: { pontuacao: true, data: true },
                    orderBy: { data: 'desc' },
                    take: 4
                });
                pontuacao = pontuacoes.reduce((acc: number, pontuacao: any) => acc + pontuacao.pontuacao, 0);
            }
            inscricao.pontuacao = pontuacao;
        }



        console.log("\nResposta: ");

        if(!inscricoes){
            console.log("Sem inscrições no torneio");
            console.log(inscricoes);
            throw new AppError('Sem inscrições no torneio\n\n\n' + inscricoes);
            
        }

        console.log("Inscrições listadas: " + inscricoes.length);
        

        return {inscricoes};
    }
}