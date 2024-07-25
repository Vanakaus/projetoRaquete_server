import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";
import { AtualizarPlacarDTO } from "../../interface/ChavesDTO";
import formataNumero from "../../functions/formatarNumero";



export class AtualizarPlacarUseCase{
    async execute({cpf, id, id_jogador, chave, id_jogador1, id_jogador2, pontuacaoJog1, pontuacaoJog2, id_vencedor}: AtualizarPlacarDTO): Promise<any>{ 

        if(cpf !== id_jogador){
            console.log("CPF não corresponde ao token");
            throw new AppError('CPF não corresponde ao token\nRefaça o login');
        }
        
        
        const partida = await prisma.partidas.findUnique({
            where: {
                id
            }
        });


        console.log("\nResposta: ");

        if(!partida){
            console.log("Partida não encontrada");
            throw new AppError('Partida não encontrada\n\n\n' + partida);
        }

        if(Number(pontuacaoJog1) < 0 || Number(pontuacaoJog2) < 0 || pontuacaoJog1 === pontuacaoJog2){
            console.log("Pontuação inválida");
            throw new AppError('Pontuação inválida\n\n\n');
        }

        if(pontuacaoJog1 > pontuacaoJog2 && id_jogador1 !== id_vencedor){
            console.log("Id do jogador 1 não corresponde ao vencedor");
            throw new AppError('Id do jogador 1 não corresponde ao vencedor\n\n\n');
        }

        if(pontuacaoJog2 > pontuacaoJog1 && id_jogador2 !== id_vencedor){
            console.log("Id do jogador 2 não corresponde ao vencedor");
            throw new AppError('Id do jogador 2 não corresponde ao vencedor\n\n\n');
        }


        const partidaAtualizada = await prisma.partidas.update({
            where: {
                id
            },
            data: {
                pontuacaoJog1,
                pontuacaoJog2,
                id_vencedor
            }
        });


        console.log("\n\nPlacar atualizado com sucesso");
        console.log(partidaAtualizada);
        


        console.log("\n\nAtualizando próxima partida");

        const novaChave = formataNumero( Number( chave.substring(0, 2) ) ) + ":" + formataNumero( Math.ceil( Number(chave.substring(3, 5)) / 2 ) );

        let novaPartida = await prisma.partidas.findFirst({
            where: {
                id_campeonato: partida.id_campeonato,
                chave: novaChave
            }
        });



        if(novaPartida){

            console.log("\n\nPróxima partida encontrada");
            console.log(novaPartida);

            if(novaPartida.id_jogador1){

                console.log("\n\nAtualizando jogador 1");
                novaPartida = await prisma.partidas.update({
                    where: {
                        id: novaPartida.id
                    },
                    data: {
                        id_jogador2: id_vencedor
                    }
                });

                console.log("\n\nPartida atualizada com sucesso");
                console.log(partidaAtualizada);

            }else if(novaPartida.id_jogador2){

                console.log("\n\nAtualizando jogador 2");
                novaPartida = await prisma.partidas.update({
                    where: {
                        id: novaPartida.id
                    },
                    data: {
                        id_jogador1: id_vencedor
                    }
                });

                console.log("\n\nPartida atualizada com sucesso");
                console.log(partidaAtualizada);
                
            }



        }else{

            console.log("\n\nPróxima partida não encontrada. Criando nova partida");

            if( Number(chave.substring(3, 5)) % 2 === 1){
                novaPartida = await prisma.partidas.create({
                    data: {
                        id_campeonato: partida.id_campeonato,
                        chave: novaChave,
                        id_jogador1: id_vencedor
                    }
                });

                console.log("\n\nPartida criada com sucesso");
                console.log(novaPartida);

            }else if( Number(chave.substring(3, 5)) % 2 === 0){
                novaPartida = await prisma.partidas.create({
                    data: {
                        id_campeonato: partida.id_campeonato,
                        chave: novaChave,
                        id_jogador2: id_vencedor
                    }
                });

                console.log("\n\nPartida criada com sucesso");
                console.log(novaPartida);

            }
        }



        return { partida, novaPartida };
    }
}

