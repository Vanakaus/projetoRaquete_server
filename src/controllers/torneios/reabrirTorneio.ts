import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";
import { ReabrirTorneioDTO } from "../../interface/TorneiosDTO";

export class ReabrirTorneioUseCase{
    async execute({ id_torneio }: ReabrirTorneioDTO): Promise<any>{

        // Busca o campeonato caso seja do criador
        const torneio = await prisma.torneios.findUnique({
            where: { id: id_torneio },
            select: {
                dataFim: true,
                id_status: true
            }

        });

        console.log("\n\nResposta: ");

        if (!torneio) {
            console.log("Torneio não encontrado");
            throw new AppError('Torneio não encontrado');
        }

        if( torneio.id_status !== Number(process.env.STATUS_FINALIZADO) ){
            console.log("Torneio não está finalizado");
            throw new AppError('Torneio não está finalizado');
        }


        // Deleta as pontuações dos participantes
        await prisma.pontuacaoRanking.deleteMany({
            where: { inscricao: { classeTorneio: { id_torneio } } }
        });


        // Atualiza o status do torneio
        const torneioStatus = await prisma.torneios.update({
            where: { id: id_torneio },
            data: { id_status: Number(process.env.STATUS_JOGOS_FINALIZADOS) },
            select: { status: true }
        });
        
        console.log(`Torneio reaberto com sucesso. Resultados removidos e status atualizado.`);

        return { torneio: torneioStatus }
    }
}