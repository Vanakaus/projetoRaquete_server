import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";
import { LeCampeonatoCriadoDTO } from "../../interface/TorneiosDTO";

export class LeCampeonatoCriadoUseCase{
    async execute({id, cpf, id_criador}: LeCampeonatoCriadoDTO): Promise<any>{
        console.log("Buscando campeonato com id: " + id + " e criado por: " + cpf + "(CPF)");

        if(cpf !== id_criador){
            console.log("CPF não corresponde ao token");
            throw new AppError('CPF não corresponde ao token\nRefaça o login');
        }

        // Busca o campeonato caso seja do criador
        const campeonato = await prisma.campeonatos.findUnique({
            where: {
                id,
                id_criador
            },
            select: {
                id: true,
                nome: true,
                descricao: true,
                regras: true,
                classe: true,
                numJogadores: true,
                premiacao: true,
                sets: true,
                status: true,
                local: true,
                dataInicio: true,
                dataFim: true,
                _count: {
                    select: {
                        inscricoes: true
                    }
                },
            }
        });

        console.log("Resposta: ");

        if (!campeonato) {
            console.log("Campeonato não encontrado");
            throw new AppError('Campeonato não encontrado');
        }

        console.log(campeonato);
        
        return campeonato;
    }
}