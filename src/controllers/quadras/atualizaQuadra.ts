import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";
import { AtualizaQuadraDTO } from "../../interface/QuadrasDTO";



export class AtualizaQuadraUseCase{
    async execute({cpf, id_jogador, id, id_campeonato, quadra}: AtualizaQuadraDTO): Promise<any>{

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



        // Verifica se o horário já foi cadastrado
        let quadraReq = await prisma.quadras.findUnique({
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

        if(!quadraReq){
            console.log("Quadra não encontrado");
            throw new AppError('Quadra não encontrado');
        }

        

        // Cria o horário
        quadraReq = await prisma.quadras.update({
            where: {
                id
            },
            data: {
                nome: quadra
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



        // Retorna o quadra criado
        console.log("Quadra atualizado: " + quadraReq.nome);
        console.log("Campeonato: " + quadraReq.campeonato.nome);
        

        return quadraReq;
    }
}