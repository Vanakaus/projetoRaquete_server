import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";
import { AtualizarPlacarDTO } from "../../interface/ChavesDTO";
import formataNumero from "../../functions/formatarNumero";



export class AtualizarPlacarUseCase{
    async execute({cpf, id, id_jogador, novoPS1, novoPS2, novoPT1, novoPT2, id_vencedor}: AtualizarPlacarDTO): Promise<any>{ 

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


        const partidaAtualizada = await prisma.partidas.update({
            where: {
                id
            },
            data: {
                placar1: {
                    update: {
                        set1: novoPS1[0],
                        set2: novoPS1[1],
                        set3: novoPS1[2],
                        set4: novoPS1[3],
                        set5: novoPS1[4],
                        tiebreak1: novoPT1[0],
                        tiebreak2: novoPT1[1],
                        tiebreak3: novoPT1[2],
                        tiebreak4: novoPT1[3],
                        tiebreak5: novoPT1[4]                        
                    }
                },
                placar2: {
                    update: {
                        set1: novoPS2[0],
                        set2: novoPS2[1],
                        set3: novoPS2[2],
                        set4: novoPS2[3],
                        set5: novoPS2[4],
                        tiebreak1: novoPT2[0],
                        tiebreak2: novoPT2[1],
                        tiebreak3: novoPT2[2],
                        tiebreak4: novoPT2[3],
                        tiebreak5: novoPT2[4]                        
                    }
                },
                id_vencedor
            }
        });


        console.log("\n\nPlacar atualizado com sucesso");
        console.log(partidaAtualizada);
        


        console.log("\n\nAtualizando próxima partida");

        const novaChave = formataNumero( Number(partida.chave.substring(0, 2)) / 2 ) + ":" + formataNumero( Math.ceil(Number(partida.chave.substring(3, 5)) / 2) );

        let novaPartidaCriada = false;
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

            novaPartidaCriada = true;

            const placar1 = await prisma.placar.create({});
            const placar2 = await prisma.placar.create({});

            if( Number(partida.chave.substring(3, 5)) % 2 === 1){
                novaPartida = await prisma.partidas.create({
                    data: {
                        id_campeonato: partida.id_campeonato,
                        chave: novaChave,
                        id_jogador1: id_vencedor,
                        id_pontuacao1: placar1.id,
                        id_pontuacao2: placar2.id
                    }
                });

            }else if( Number(partida.chave.substring(3, 5)) % 2 === 0){

                novaPartida = await prisma.partidas.create({
                    data: {
                        id_campeonato: partida.id_campeonato,
                        chave: novaChave,
                        id_jogador2: id_vencedor,
                        id_pontuacao1: placar1.id,
                        id_pontuacao2: placar2.id
                    }
                });
            }

                console.log("\n\nPartida criada com sucesso");
                console.log(novaPartida);

        }

        novaPartida = await prisma.partidas.findFirst({
            select: {
                id: true,
                id_campeonato: true,
                chave: true,
                id_jogador1: true,
                id_jogador2: true,
                id_pontuacao1: true,
                id_pontuacao2: true,
                id_vencedor: true,
                dataPartida: true,
                localPartida: true,
                placar1: true,
                placar2: true,
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



        return { partidaAtualizada, novaPartida, novaPartidaCriada};
    }
}

