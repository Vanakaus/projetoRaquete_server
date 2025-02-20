import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";
import { AtualizarDatasDTO, novaData } from "../../interface/ChavesDTO";



export class AtualizardadosUseCase{
    async execute({ novosDados }: AtualizarDatasDTO): Promise<any>{

        console.log("\nResposta: ");


        // Variaveis para armazenar as partidas atualizadas e não atualizadas na resposta
        const partidasAtualizadas = [] as novaData[];
        const partidasNaoAtualizadas = [] as novaData[];

        for (const data of novosDados) {
            
            // Verifica se a partida é válida
            const partida = await prisma.partidas.findUnique({
                where: {
                    id: data.id
                }
            });
            if (!partida){
                console.log("Partida não encontrada");
                data.resposta = "Partida não encontrada";
                partidasNaoAtualizadas.push(data);
                continue;
            }


            
            // Atualiza a partida
            const partidaAtualizada = await prisma.partidas.update({
                where: {
                    id: data.id
                },
                data: {
                    dataPartida: data.data,
                    horaPartida: data.hora,
                    local: data.local
                }
            });

            if(!partidaAtualizada){
                data.resposta = "Erro ao atualizar a partida";
                partidasNaoAtualizadas.push(data);
            }else{
                partidasAtualizadas.push(data);
            }
        }


        console.log("Partidas atualizadas: ", partidasAtualizadas.length);
        console.log("Partidas não atualizadas: ", partidasNaoAtualizadas.length);


        return { partidasAtualizadas, partidasNaoAtualizadas };
    }
}

