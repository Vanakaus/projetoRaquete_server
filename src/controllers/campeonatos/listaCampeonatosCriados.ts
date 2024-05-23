import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";
import { ListaCampeonatosCriadosDTO } from "../../interface/CampeonatoUsersDTO";

export class ListaCampeonatosCriadosUseCase{
    async execute({cpf, id_criador}: ListaCampeonatosCriadosDTO): Promise<any>{

        if(cpf !== id_criador){
            console.log("CPF não corresponde ao token");
            throw new AppError('CPF não corresponde ao token\nRefaça o login');
        }


        // Busca todos os campeonatos criados pelo usuário
        const campeonatos = await prisma.campeonatos.findMany({
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
                id_criador
            }
        });

        console.log("Resposta: ");

        if (campeonatos.length === 0) {
            console.log("Sem Campeonatos criados pelo usuário");
            throw new AppError('Sem Campeonatos criados pelo usuário\n\n\n' + campeonatos);
        }

        console.log(campeonatos.length + " Campeonatos Listados com sucesso");
        
        return campeonatos;
    }
}