import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";
import { Quadras } from "@prisma/client";
import { CriaQuadraDTO } from "../../interface/QuadrasDTO";



export class CriaQuadraUseCase{
    async execute({cpf, id_jogador, id_campeonato, quadra}: CriaQuadraDTO): Promise<Quadras>{


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
        let quadraReq = await prisma.quadras.findFirst({
            where: {
                id_campeonato,
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

        if(quadraReq){
            console.log("Quadra já cadastrado");
            throw new AppError('Quadra já cadastrado');
        }

        

        // Cria a quadra
        quadraReq = await prisma.quadras.create({
            data: {
                id_campeonato,
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



        // Retorna a quadra criada
        console.log("Quadra criada: " + quadraReq.nome);
        console.log("Campeonato: " + quadraReq.campeonato.nome);
        

        return quadraReq;
    }
}