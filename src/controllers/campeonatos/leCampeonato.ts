import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";

export class LeCampeonatoUseCase{
    async execute(id: string): Promise<any>{

        // Busca todos os campeonatos e o seus criadores
        const campeonato = await prisma.campeonatos.findUnique({
            where: {
                id
            },
            select: {
                id: true,
                nome: true,
                descricao: true,
                classe: true,
                numJogadores: true,
                premiacao: true,
                local: true,
                dataInicio: true,
                dataFim: true,
                criador: {
                    select: {
                        nome: true,
                        username: true,
                        email: true
                    }
                }
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