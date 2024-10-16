import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";
import { AtualizarDatasDTO } from "../../interface/ChavesDTO";



export class AtualizardatasUseCase{
    async execute({cpf, id_jogador, novasDatas}: AtualizarDatasDTO): Promise<any>{ 

        if(cpf !== id_jogador){
            console.log("CPF não corresponde ao token");
            throw new AppError('CPF não corresponde ao token\nRefaça o login');
        }

        console.log("\nResposta: ");

        if (!novasDatas) {
            console.log("Datas vazias");
            throw new AppError('Datas vazias');
        }

        console.log("\nAtualizando datas");

        const partidasAtualizadas = [] as { id: number, data: string } [];
        const partidasNaoAtualizadas = [] as { id: number, data: string }[];

        for (const data of novasDatas) {

            const partida = await prisma.partidas.findUnique({
                where: {
                    id: data.id
                }
            });

            if(!partida){
                partidasNaoAtualizadas.push(data);
                continue;
            }

            const partidaAtualizada = await prisma.partidas.update({
                where: {
                    id: data.id
                },
                data: {
                    dataPartida: data.data
                }
            });

            if(!partidaAtualizada){
                partidasNaoAtualizadas.push({ id: data.id, data: new Date().toISOString() });
            } else {
                partidasAtualizadas.push({ id: data.id, data: data.data });
            }
        }

        console.log("Partidas atualizadas: ");
        console.log(partidasAtualizadas);

        console.log("Partidas não atualizadas: ");
        console.log(partidasNaoAtualizadas);



        return { partidasAtualizadas, partidasNaoAtualizadas };
    }
}

