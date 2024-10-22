import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";
import { LimparChaveDTO } from "../../interface/ChavesDTO";



export class LimparChaveUseCase{
    async execute({cpf, id_jogador, id_campeonato}: LimparChaveDTO): Promise<any>{

        if(cpf !== id_jogador){
            console.log("CPF não corresponde ao token");
            throw new AppError('CPF não corresponde ao token\nRefaça o login');
        }
        
        
        let campeonato = await prisma.campeonatos.findUnique({
            where: {
                id: id_campeonato
            },
            select: {
                id: true,
                id_criador: true,
                nome: true,
                status: true,
            }
        });


        console.log("\nResposta: ");

        if(!campeonato){
            console.log("Campeonato não encontrado");
            throw new AppError('Campeonato não encontrado\n\n\n' + campeonato);
        }


        if(campeonato.id_criador !== id_jogador){
            console.log("Você não é o dono do campeonato");
            throw new AppError('Você não é o dono do campeonato\n\n\n' + campeonato);
        }


        if(campeonato.status.id !== 3 && campeonato.status.id !== 4){
            console.log("Não é possível limpar os jogos \nCampeonato Status: " + campeonato.status);
            throw new AppError('Não é possível limpar os jogos \nCampeonato Status: ' + campeonato.status);
        }


1
        console.log("Deletando inscrições do campeonato: ");
        console.log("\tID: " + id_campeonato);
        console.log("\tNome: " + campeonato.nome);
        const inscricoes = await prisma.partidas.deleteMany({
            where: {
                id_campeonato
            }
        });

        
        console.log("\n\nInscrições deletadas com sucesso");
        console.log(inscricoes);
        console.log("\n\n");


        campeonato = await prisma.campeonatos.update({
            where: {
                id: id_campeonato
            },
            data: {
                id_status: 2
            },
            select: {
                id: true,
                id_criador: true,
                nome: true,
                id_status: true,
                status: {
                    select: {
                        id: true,
                        nome: true
                    }
                }
            }
        });


        return {inscricoes, partidas:[], campeonato};
    }
}

