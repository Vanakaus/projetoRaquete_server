import { Inscricao } from "@prisma/client";
import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";
import { ListaInscricoesDTO } from "../../interface/InscricaoUsersDTO";



export class ListaInscricoesUseCase{
    async execute({cpf, id_jogador}: ListaInscricoesDTO): Promise<any>{

        if(cpf !== id_jogador){
            console.log("CPF não corresponde ao token");
            throw new AppError('CPF não corresponde ao token\nRefaça o login');
        }
        
        
        // Busca todos os campeonatos que o jogador está inscrito
        const inscricoes = await prisma.campeonatos.findMany({
            select: {
                id: true,
                nome: true,
                descricao: true,
                classe: true,
                numJogadores: true,
                premiacao: true,
                local: true,
                status: true,
                dataInicio: true,
                dataFim: true,
                inscricoes: {
                    where: {
                        id_jogador: cpf
                    },
                    select: {
                        situacao: true
                    }
                },
                _count: {
                    select: {
                        inscricoes: true
                    }
                },
            },
            where: {
                inscricoes: {
                    some: {
                        id_jogador: cpf
                    }
                }
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