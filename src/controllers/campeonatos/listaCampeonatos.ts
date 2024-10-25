import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";
import { ListaCampeonatoDTO } from "../../interface/CampeonatoUsersDTO";

export class ListaCampeonatosUseCase{
    async execute({cpf}: ListaCampeonatoDTO): Promise<any>{

        // Busca todos os campeonatos e o seus criadores
        const campeonatos = await prisma.campeonatos.findMany({
            select: {
                id: true,
                nome: true,
                descricao: true,
                classe: true,
                numJogadores: true,
                premiacao: true,
                sets: true,
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
            orderBy: {
                dataInicio: 'asc'
            }
        });

        console.log("Resposta: ");

        if (campeonatos.length === 0) {
            console.log("Sem Campeonatos cadastrados");
            throw new AppError('Sem Campeonatos cadastrados');
        }

        console.log(campeonatos.length + " Campeonatos Listados com sucesso");
        
        return campeonatos;
    }
}