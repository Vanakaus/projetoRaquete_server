import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";
import { LeCampeonatoDTO } from "../../interface/CampeonatoUsersDTO";

export class LeCampeonatoUseCase{
    async execute({id, cpf}: LeCampeonatoDTO): Promise<any>{
        console.log("Buscando campeonato com id: " + id + " e cpf: " + cpf);

        // Busca todos os campeonatos e o seus criadores
        const campeonato = await prisma.campeonatos.findUnique({
            where: {
                id
            },
            select: {
                id: true,
                nome: true,
                descricao: true,
                regras: true,
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
                criador: {
                    select: {
                        nome: true,
                        username: true,
                        email: true
                    }
                },
                _count: {
                    select: {
                        inscricoes: true
                    }
                },
            }
        });

        console.log("Resposta: ");

        if (!campeonato) {
            console.log("Sem Campeonatos cadastrados");
            throw new AppError('Sem Campeonatos cadastrados');
        }

        console.log(campeonato);
        
        return campeonato;
    }
}