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
        let horarioReq = await prisma.horarios.findUnique({
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

        if(!horarioReq){
            console.log("Horário não encontrado");
            throw new AppError('Horário não encontrado');
        }



        // Verifica se o horário já foi cadastrado
        horarioReq = await prisma.horarios.findFirst({
            where: {
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

        if(horarioReq){
            console.log("Horário já cadastrado");
            throw new AppError('Horário já cadastrado');
        }

        

        // Atualiza o horário
        horarioReq = await prisma.horarios.update({
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



        // Atualiza as partidas que possuem o horário
        const partidas = await prisma.partidas.findMany({
            where: {
                id_campeonato,
                id_data: id
            }
        });

        for (const partida of partidas) {

            if (partida.dataPartida) {
                const dataPartida = new Date(partida.dataPartida);
                dataPartida.setHours(parseInt(horarioReq.horario.split(":")[0], 10));
                dataPartida.setMinutes(parseInt(horarioReq.horario.split(":")[1], 10));
                await prisma.partidas.update({
                    where: {
                        id: partida.id
                    },
                    data: {
                        dataPartida
                    }
                });
            }
        }



        // Retorna o horário criado
        console.log("Horário atualizado: " + horarioReq.horario);
        console.log("Campeonato: " + horarioReq.campeonato.nome);
        

        return horarioReq;
    }
}