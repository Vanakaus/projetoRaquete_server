import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";
import { ListaTorneiosPrincipaisAcademiaDTO } from "../../interface/TorneiosDTO";

export class ListaTorneiosPrincipaisUseCase{
    async execute({ id_academia }: ListaTorneiosPrincipaisAcademiaDTO): Promise<any>{

        const select = {
            id: true,
            nome: true,
            local: true,
            simples: true,
            duplas: true,
            dataInicio: true,
            dataFim: true,
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
                    },
                    _count: {
                        select: {
                            inscricao: true
                        }
                    }
                },
            },
        };

        const dataAtual = new Date();


        const torneiosEmAndamento = await prisma.torneios.findMany({
            where: {
                id_academia,
                dataInicio: { lte: dataAtual },
                dataFim: { gte: dataAtual },
                status: { id: Number(process.env.STATUS_EM_ANDAMENTO) }
            },
            take: 10,
            select,
            orderBy: {
                dataInicio: 'asc'
            }
        });

        const proximosTorneios = await prisma.torneios.findMany({
            where: {
                id_academia,
                dataInicio: { gte: dataAtual },
                status: { id: { not: Number(process.env.STATUS_FINALIZADO) } }
            },
            take: 10,
            select,
            orderBy: {
                dataInicio: 'asc'
            }
        });

        const ultimosTorneios = await prisma.torneios.findMany({
            where: {
                id_academia,
                status: { id: Number(process.env.STATUS_FINALIZADO) }
            },
            take: 10,
            select,
            orderBy: {
                dataInicio: 'desc'
            }
        }); 

        
        console.log("Resposta: ");

        if (!torneiosEmAndamento && !proximosTorneios && !ultimosTorneios) {
            console.log("Erro ao listar os torneios principais");
            throw new AppError("Erro ao listar os torneios principais", 404);
        }

        console.log("Listados os torneios principais com sucesso");
        
        return { torneiosEmAndamento, proximosTorneios, ultimosTorneios  };
    }
}