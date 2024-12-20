import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";
import { DeletaHorarioDTO } from "../../interface/HorarioDTO";



export class DeletaHorarioUseCase{
    async execute({cpf, id_jogador, id_campeonato, id}: DeletaHorarioDTO): Promise<any>{

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
        let horario = await prisma.horarios.findUnique({
            where: {
                id,
                id_campeonato
            },
            select: {
                id: true,
                id_campeonato: true,
                horario: true,
                campeonato: {
                    select: {
                        nome: true
                    }
                }
            }
        });

        if(!horario){
            console.log("Horário não encontrado");
            throw new AppError('Horário não encontrado');
        }

        

        // Cria o horário
        horario = await prisma.horarios.delete({
            where: {
                id
            },
            select: {
                id: true,
                id_campeonato: true,
                horario: true,
                campeonato: {
                    select: {
                        nome: true
                    }
                }
            }
        });



        // Retorna o horário criado
        console.log("Horário deletado: " + horario.horario);
        console.log("Campeonato: " + horario.campeonato.nome);
        

        return horario;
    }
}