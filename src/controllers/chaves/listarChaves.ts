import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";
import { ListarChaveDTO } from "../../interface/ChavesDTO";



export class ListarChavesUseCase{
    async execute({cpf, id_jogador, id_campeonato}: ListarChaveDTO): Promise<any>{

        if(cpf !== id_jogador){
            console.log("CPF não corresponde ao token");
            throw new AppError('CPF não corresponde ao token\nRefaça o login');
        }
        
        
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
        console.log("Listando chaves do campeonato: ");
        console.log("\tID: " + id_campeonato);
        console.log("\tNome: " + campeonato.nome);
        const partidas = await prisma.partidas.findMany({
            select: {
                id: true,
                id_campeonato: true,
                chave: true,
                id_jogador1: true,
                id_jogador2: true,
                pontuacaoJog1: true,
                pontuacaoJog2: true,
                id_vencedor: true,
                dataPartida: true,
                localPartida: true,
                campeonato: {
                    select: {
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

        
        console.log("\n\nChaves listadas com sucesso");
        console.log(partidas);
        console.log("\n\n");


        return partidas;
    }
}

