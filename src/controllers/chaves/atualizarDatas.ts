import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";
import { AtualizarDatasDTO } from "../../interface/ChavesDTO";



export class AtualizardatasUseCase{
    async execute({cpf, id_jogador, id_campeonato, novasDatas}: AtualizarDatasDTO): Promise<any>{ 

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

        const partidasAtualizadas = [] as { id: number, data: number, local: number } [];
        const partidasNaoAtualizadas = [] as { id: number, data: number, local: number } [];

        for (const data of novasDatas) {

            
            const quadra = await prisma.quadras.findUnique({
                where: {
                    id: data.local,
                    id_campeonato
                }
            });

            if (!quadra){
                partidasNaoAtualizadas.push(data);
                continue;
            }



            const horario = await prisma.horarios.findUnique({
                where: {
                    id: data.data,
                    id_campeonato
                }, select: {
                    id: true,
                    horario: true
                }
            });

            if (!horario){
                partidasNaoAtualizadas.push(data);
                continue;
            }

            

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
                    dataPartida: horario.horario,
                    id_data: horario.id,
                    id_local: quadra.id
                }
            });

            if(!partidaAtualizada){
                partidasNaoAtualizadas.push(data);
            } else {
                partidasAtualizadas.push(data);
            }
        }

        console.log("Partidas atualizadas: ");
        console.log(partidasAtualizadas);

        console.log("Partidas não atualizadas: ");
        console.log(partidasNaoAtualizadas);



        return { partidasAtualizadas, partidasNaoAtualizadas };
    }
}

