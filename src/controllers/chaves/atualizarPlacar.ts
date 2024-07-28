import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";
import { AtualizarPlacarDTO } from "../../interface/ChavesDTO";
import formataNumero from "../../functions/formatarNumero";



export class AtualizarPlacarUseCase{
    async execute({cpf, id, id_jogador, pontuacao1, pontuacao2, id_vencedor}: AtualizarPlacarDTO): Promise<any>{ 

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

        if(Number(pontuacao1) < 0 || Number(pontuacao2) < 0 || pontuacao1 === pontuacao2){
            console.log("Pontuação inválida");
            console.log("Pontuação 1: ", pontuacao1);
            console.log("Pontuação 2: ", pontuacao2);
            throw new AppError('Pontuação inválida\n\n\n');
        }

        if(pontuacao1 > pontuacao2 && partida.id_jogador1 !== id_vencedor){
            console.log("Id do jogador 1 não corresponde ao vencedor");
            throw new AppError('Id do jogador 1 não corresponde ao vencedor\n\n\n');
        }

        if(pontuacao2 > pontuacao1 && partida.id_jogador2 !== id_vencedor){
            console.log("Id do jogador 2 não corresponde ao vencedor");
            throw new AppError('Id do jogador 2 não corresponde ao vencedor\n\n\n');
        }


        const partidaAtualizada = await prisma.partidas.update({
            where: {
                id
            },
            data: {
                pontuacao1,
                pontuacao2,
                id_vencedor
            }
        });


        console.log("\n\nPlacar atualizado com sucesso");
        console.log(partidaAtualizada);
        


        console.log("\n\nAtualizando próxima partida");

        const novaChave = formataNumero( Number(partida.chave.substring(0, 2)) / 2 ) + ":" + formataNumero( Math.ceil(Number(partida.chave.substring(3, 5)) / 2) );

        let novaPartida = await prisma.partidas.findFirst({
            where: {
                id_campeonato: partida.id_campeonato,
                chave: novaChave
            }
        });



        if(novaPartida){

            console.log("\n\nPróxima partida encontrada");
            console.log(novaPartida);

            if(Number(partida.chave.substring(3, 5)) % 2 === 1){

                console.log("\n\nAtualizando jogador 1");
                novaPartida = await prisma.partidas.update({
                    where: {
                        id: novaPartida.id
                    },
                    data: {
                        id_jogador1: id_vencedor
                    }
                });

            }else if(Number(partida.chave.substring(3, 5)) % 2 === 0){

                console.log("\n\nAtualizando jogador 2");
                novaPartida = await prisma.partidas.update({
                    where: {
                        id: novaPartida.id
                    },
                    data: {
                        id_jogador2: id_vencedor
                    }
                });
            }
            
            console.log("\n\nPartida atualizada com sucesso");
            console.log(partidaAtualizada);


        }else{

            console.log("\n\nPróxima partida não encontrada. Criando nova partida");

            if( Number(partida.chave.substring(3, 5)) % 2 === 1){
                novaPartida = await prisma.partidas.create({
                    data: {
                        id_campeonato: partida.id_campeonato,
                        chave: novaChave,
                        id_jogador1: id_vencedor
                    }
                });

            }else if( Number(partida.chave.substring(3, 5)) % 2 === 0){
                novaPartida = await prisma.partidas.create({
                    data: {
                        id_campeonato: partida.id_campeonato,
                        chave: novaChave,
                        id_jogador2: id_vencedor
                    }
                });
            }

                console.log("\n\nPartida criada com sucesso");
                console.log(novaPartida);

        }

        novaPartida = await prisma.partidas.findFirst({
            select:{
                id: true,
                id_campeonato: true,
                chave: true,
                id_jogador1: true,
                id_jogador2: true,
                pontuacao1: true,
                pontuacao2: true,
                id_vencedor: true,
                dataPartida: true,
                localPartida: true,
                jogador1: {
                    select: {
                        jogador: {
                            select: {
                                username: true,
                                nome: true,
                                sobrenome: true,
                                rank: true
                            }
                        }
                    }
                },
                jogador2: {
                    select: {
                        jogador: {
                            select: {
                                username: true,
                                nome: true,
                                sobrenome: true,
                                rank: true
                            }
                        }
                    }
                },
                campeonato: {
                    select: {
                        nome: true
                    }
                }
            },
            where: {
                id: novaPartida?.id
            }
        });



        return { partidaAtualizada, novaPartida};
    }
}

