import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";
import { ListaInscricoesCampeonatoDTO } from "../../interface/InscricaoUsersDTO";



export class ListaInscricoesCampeonatoUseCase{
    async execute({cpf, id_jogador, id_campeonato}: ListaInscricoesCampeonatoDTO): Promise<any>{

        if(cpf !== id_jogador){
            console.log("CPF não corresponde ao token");
            throw new AppError('CPF não corresponde ao token\nRefaça o login');
        }
        
        
        // Busca todos os incritos no campeonato
        const inscricoes = await prisma.inscricao.findMany({
            select: {
                id: true,
                id_jogador: true,
                situacao: true,
                dataInscricao: true,
                campeonato: {
                    select: {
                        nome: true
                    }
                },
                jogador: {
                    select: {
                        username: true,
                        nome: true,
                        sobrenome: true,
                        rank: true,
                        classe: true
                    }
                }
            },
            where: {
                id_campeonato: id_campeonato
            }
        });


        console.log("\nResposta: ");

        if(!inscricoes){
            console.log("Sem inscrições realizadas");
            console.log(inscricoes);
            throw new AppError('Sem inscrições realizadas\n\n\n' + inscricoes);
            
        }

        console.log("Inscrições listadas: " + inscricoes.length);
        

        return inscricoes;
    }
}