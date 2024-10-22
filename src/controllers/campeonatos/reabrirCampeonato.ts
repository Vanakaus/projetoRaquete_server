import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";
import { ReabrirCampeonatoDTO } from "../../interface/CampeonatoUsersDTO";

export class ReabrirCampeonatoUseCase{
    async execute({id, cpf, id_criador}: ReabrirCampeonatoDTO): Promise<any>{

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
                dataInscricao: true,
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

        
        if (campeonato.id_status !== 5 && campeonato.id_status !== 6){
                console.log("Ação indisponível");
                throw new AppError('Ação indisponível');
        }


        const jogos = await prisma.partidas.findFirst({
            where: {
                id_campeonato: id
            }
        });


        // Atualiza o status do campeonato
        if(jogos)
            campeonato = await prisma.campeonatos.update({
                where: {
                    id
                },
                data: {
                    id_status: 4
                },
                select: {
                    id: true, 
                    id_criador: true, 
                    id_status: true, 
                    nome: true,
                    dataInscricao: true,
                    status: {
                        select: {
                            id: true,
                            nome: true
                        }
                    }
                }
            });
        
        else {

            const dataAtual = new Date();
            dataAtual.setHours(dataAtual.getHours() - 3);
                
            campeonato = await prisma.campeonatos.update({
                where: {
                    id
                },
                data: {
                    id_status: dataAtual < campeonato.dataInscricao ? 1 : 2
                },
                select: {
                    id: true, 
                    id_criador: true, 
                    id_status: true, 
                    nome: true,
                    dataInscricao: true,
                    status: {
                        select: {
                            id: true,
                            nome: true
                        }
                    }
                }
            });
        }


        
        console.log(`Campeonato ${campeonato.nome} reaberto com sucesso`);

        return {campeonato};
    }
}