import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";
import { ListarChaveDTO } from "../../interface/ChavesDTO";



export class ListarChavesUseCase{
    async execute({id_campeonato}: ListarChaveDTO): Promise<any>{

        
        const campeonato = await prisma.campeonatos.findUnique({
            where: {
                id: id_campeonato
            }
        });


        console.log("\nResposta: ");

        if(!campeonato){
            console.log("Campeonato não encontrado");
            throw new AppError('Campeonato não encontrado\n\n\n' + campeonato);
        }


        // if(campeonato.status !== 'Chaves Geradas'){
        //     console.log("Não é possível gerar chave \nCampeonato Status: " + campeonato.status);
        //     throw new AppError('Não é possível gerar chave \nCampeonato Status: ' + campeonato.status);
        // }


1
        console.log("Listando jogos do campeonato: ");
        console.log("\tID: " + id_campeonato);
        console.log("\tNome: " + campeonato.nome);
        const partidas = await prisma.partidas.findMany({
            select: {
                id: true,
                id_campeonato: true,
                chave: true,
                id_jogador1: true,
                id_jogador2: true,
                id_vencedor: true,
                dataPartida: true,
                id_data: true,
                id_local: true,
                placar1: true,
                placar2: true,
                campeonato: {
                    select: {
                        nome: true,
                        sets: true,
                    }
                },
                data: {
                    select: {
                        id: true,
                        horario: true
                    }
                },
                quadra: {
                    select: {
                        id: true,
                        nome: true
                    }
                },
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
                }
            },
            where: {
                id_campeonato
            },
            orderBy: {
                chave: 'asc'
            }
        });

        
        console.log("\n\nJogos listadas com sucesso: ", partidas.length);
        // console.log(partidas);
        console.log("\n\n");


        return partidas;
    }
}

