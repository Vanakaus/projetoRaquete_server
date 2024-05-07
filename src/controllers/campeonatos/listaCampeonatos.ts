import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";

export class ListCampeonatosUseCase{
    async execute(): Promise<any>{

        // Busca todos os campeonatos e o seus criadores
        const campeonatos = await prisma.campeonatos.findMany({
            select: {
                id: true,
                nome: true,
                descricao: true,
                tipo: true,
                classe: true,
                numJogadores: true,
                premiacao: true,
                local: true,
                dataInicio: true,
                dataFim: true
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