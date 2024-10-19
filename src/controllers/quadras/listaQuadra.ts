import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";
import { ListaQuadrasDTO } from "../../interface/QuadrasDTO";



export class ListaQuadrasUseCase{
    async execute({cpf, id_jogador, id_campeonato}: ListaQuadrasDTO): Promise<any>{

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


        // Busca todos as quadras quadras do campeonato
        const quadras = await prisma.quadras.findMany({
            select: {
                id: true,
                nome: true
            },
            where: {
                id_campeonato
            },
            orderBy: {
                nome: 'asc'
            }
        });


        console.log("Quadra listados: " + quadras.length);

        return quadras;
    }
}