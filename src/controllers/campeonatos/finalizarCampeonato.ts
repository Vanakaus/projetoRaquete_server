import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";
import { FinalizarTorneioDTO } from "../../interface/TorneiosDTO";

export class FinalizarTorneioUseCase{
    async execute({ idTorneio, resultados }: FinalizarTorneioDTO): Promise<any>{

        // Busca o campeonato caso seja do criador
        let torneio = await prisma.torneios.findUnique({
            where: {
                id: idTorneio
            }
        });

        console.log("\n\nResposta: ");

        if (!torneio) {
            console.log("Torneio não encontrado");
            throw new AppError('Torneio não encontrado');
        }

        if( torneio.id_status < Number(process.env.STATUS_TORNEIO_FINALIZADO) ){
            console.log("Jogos não finalizados");
            throw new AppError('Jogos não finalizados');
        }


        // Adiciona a pontuação dos participantes
        for (const resultado of resultados) {
            await prisma.pontuacaoRanking.create({
                data: {
                    id_inscricao: resultado.inscricao.id,
                    posicao: resultado.posicao,
                    pontuacao: resultado.pontuacao,
                }
            });
        }


        // Atualiza o status do torneio
        await prisma.torneios.update({
            where: { id: idTorneio },
            data: { id_status: Number(process.env.STATUS_FINALIZADO) }
        });
        
        console.log(`Torneio finalizado com sucesso \n${resultados.length} resultados adicionados com sucesso`);

        return {};
    }
}