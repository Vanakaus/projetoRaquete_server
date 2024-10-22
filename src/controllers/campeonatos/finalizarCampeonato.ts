import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";
import { FinalizarCampeonatoDTO } from "../../interface/CampeonatoUsersDTO";

export class FinalizarCampeonatoUseCase{
    async execute({id, cpf, id_criador, cancela}: FinalizarCampeonatoDTO): Promise<any>{

        if(cpf !== id_criador){
            console.log("CPF não corresponde ao token");
            throw new AppError('CPF não corresponde ao token\nRefaça o login');
        }

        // Busca o campeonato caso seja do criador
        let campeonato = await prisma.campeonatos.findUnique({
            where: {
                id
            }, select: {
                id: true, 
                id_criador: true, 
                id_status: true, 
                nome: true,
                status: {
                    select: {
                        id: true,
                        nome: true
                    }
                }
            }
        });

        console.log("Resposta: ");

        if (!campeonato) {
            console.log("Campeonato não encontrado");
            throw new AppError('Campeonato não encontrado');
        }

        if(campeonato.id_criador !== cpf){
            console.log("CPF não corresponde ao criador");
            throw new AppError('CPF não corresponde ao criador');
        }

        if(cancela){

            if (campeonato.id_status === 6){
                console.log("Campeonato já está cancelado");
                throw new AppError('Campeonato já está cancelado');
            }

        } else {

            if (campeonato.id_status !== 4){
                console.log("Ação indisponível");
                throw new AppError('Ação indisponível');
            }

        }


        // Atualiza o status do campeonato
        campeonato = await prisma.campeonatos.update({
            where: {
                id
            },
            data: {
                id_status: cancela ? 6 : 5
            },
            select: {
                id: true, 
                id_criador: true, 
                id_status: true, 
                nome: true,
                status: {
                    select: {
                        id: true,
                        nome: true
                    }
                }
            }
        });
        
        console.log(`Campeonato ${campeonato.nome} ${cancela ? 'cancelado' : 'finalizado'} com sucesso`);

        return {campeonato};
    }
}