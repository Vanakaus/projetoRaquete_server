import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";
import { Horarios } from "@prisma/client";
import { CriaHorarioDTO } from "../../interface/HorarioDTO";



export class CriaHorarioUseCase{
    async execute({cpf, id_jogador, id_campeonato, horario}: CriaHorarioDTO): Promise<Horarios>{


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
        const horarioCadastrado = await prisma.horarios.findFirst({
            where: {
                id_campeonato: id_campeonato,
                horario: horario
            }
        });

        if(horarioCadastrado){
            console.log("Horário já cadastrado");
            throw new AppError('Horário já cadastrado');
        }

        

        // Cria o horário
        const horarioCriado = await prisma.horarios.create({
            data: {
                id_campeonato,
                horario
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
        console.log("Horário criado: " + horarioCriado.horario);
        console.log("Campeonato: " + horarioCriado.campeonato.nome);
        

        return horarioCriado;
    }
}