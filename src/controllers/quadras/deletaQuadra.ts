import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";
import { DeletaQuadraDTO } from "../../interface/QuadrasDTO";



export class DeletaQuadraUseCase{
    async execute({cpf, id_jogador, id_campeonato, id}: DeletaQuadraDTO): Promise<any>{

        // Verifica se o cpf passado é o mesmo do token
        if(cpf !== id_jogador){
            console.log("CPF não corresponde ao token");
            throw new AppError('CPF não corresponde ao token\nRefaça o login');
        }

        
        // Verifica se o campeonato existe e se o jogador é o responsável por ele
        const campeonato = await prisma.campeonatos.findFirst({
            select: {
                id_criador: true,
            },
            where: {
                id: id_campeonato
            }
        });



        console.log("\nResposta: ");

        if(!campeonato){
            console.log("Campeonato não encontrado");
            throw new AppError('Campeonato não encontrado');
        }

        if(campeonato.id_criador !== id_jogador){
            console.log("Usuário não é o responsavel pelo campeonato");
            throw new AppError('Usuário não é o responsavel pelo campeonato');
        }



        // Verifica se a quadra já foi cadastrada
        let quadra = await prisma.quadras.findUnique({
            where: {
                id,
                id_campeonato
            },
            select: {
                id: true,
                id_campeonato: true,
                nome: true,
                campeonato: {
                    select: {
                        nome: true
                    }
                }
            }
        });

        if(!quadra){
            console.log("Quadra não encontrada");
            throw new AppError('Quadra não encontrada');
        }

        

        // Cria a quadra
        quadra = await prisma.quadras.delete({
            where: {
                id
            },
            select: {
                id: true,
                id_campeonato: true,
                nome: true,
                campeonato: {
                    select: {
                        nome: true
                    }
                }
            }
        });



        // Retorna o horário criado
        console.log("Quadra deletada: " + quadra.nome);
        console.log("Campeonato: " + quadra.campeonato.nome);
        

        return quadra;
    }
}