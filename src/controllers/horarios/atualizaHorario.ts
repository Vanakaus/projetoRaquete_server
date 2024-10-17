import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";
import { AtualizaHorarioDTO } from "../../interface/HorarioDTO";



export class AtualizaHorarioUseCase{
    async execute({cpf, id_jogador, id, id_campeonato, horario}: AtualizaHorarioDTO): Promise<any>{

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
        const horarioCadastrado = await prisma.horarios.findUnique({
            where: {
                id,
                id_campeonato
            }
        });

        if(!horarioCadastrado){
            console.log("Horário não encontrado");
            throw new AppError('Horário não encontrado');
        }

        

        // Cria o horário
        const horarioCriado = await prisma.horarios.update({
            where: {
                id
            },
            data: {
                horario: horario
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
        console.log("Horário atualizado: " + horarioCriado.horario);
        console.log("Campeonato: " + horarioCriado.campeonato.nome);
        

        return horarioCriado;
    }
}