import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";
import { AtualizarDatasDTO } from "../../interface/ChavesDTO";
import formataNumero from "../../functions/formatarNumero";



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

        const partidasAtualizadas = [] as Number[];
        const partidasNaoAtualizadas = [] as Number[];

        for (const data of novasDatas) {

            console.log("Atualizando partida com id: " + data.id + " para data: " + data.data);

            const partida = await prisma.partidas.findUnique({
                where: {
                    id: data.id
                }
            });

            if(!partida){
                console.log("Partida não encontrada");
                partidasNaoAtualizadas.push(data.id);
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

            partidasAtualizadas.push(partidaAtualizada.id);
        }

        console.log("Partidas atualizadas: ");
        console.log(partidasAtualizadas);

        console.log("Partidas não atualizadas: ");
        console.log(partidasNaoAtualizadas);



        return { partidasAtualizadas, partidasNaoAtualizadas };
    }
}

