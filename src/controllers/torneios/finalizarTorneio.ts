import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";
import { FinalizarTorneioDTO } from "../../interface/TorneiosDTO";

export class FinalizarTorneioUseCase{
    async execute({ id_torneio, resultados }: FinalizarTorneioDTO): Promise<any>{

        // Busca o campeonato caso seja do criador
        const torneio = await prisma.torneios.findUnique({
            where: { id: id_torneio },
            select: {
                dataFim: true,
                status: true
            }

        });

        console.log("\n\nResposta: ");

        if (!torneio) {
            console.log("Torneio não encontrado");
            throw new AppError('Torneio não encontrado');
        }

        if( torneio.status.id !== Number(process.env.STATUS_JOGOS_FINALIZADOS) ){
            console.log("Jogos não finalizados");
            throw new AppError('Jogos não finalizados');
        }


        // Adiciona a pontuação dos participantes        
        try {
            for (const resultado of resultados) {
                await prisma.pontuacaoRanking.create({
                    data: {
                        id_inscricao: resultado.inscricao.id,
                        posicao: resultado.posicao,
                        pontuacao: resultado.pontuacao,
                    }
                });
            }
        } catch (error) {
            console.log("Erro ao adicionar pontuação dos participantes", error);
            throw new AppError('Torneio já possui resultados cadastrados');
        }


        // Atualiza o status do torneio
        const torneioStatus = await prisma.torneios.update({
            where: { id: id_torneio },
            data: {
                id_status: Number(process.env.STATUS_FINALIZADO),
                dataFim: torneio.dataFim < new Date() ? new Date() : torneio.dataFim,
            },
            select: { status: true }
        });
        
        console.log(`Torneio finalizado com sucesso \n${resultados.length} resultados adicionados com sucesso`);

        return { torneio: torneioStatus }
    }
}