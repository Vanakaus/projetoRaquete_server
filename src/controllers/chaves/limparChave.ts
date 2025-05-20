import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";
import { LimparChaveDTO } from "../../interface/ChavesDTO";



export class LimparChaveUseCase{
    async execute({ id_torneio, id_classeTorneio }: LimparChaveDTO): Promise<any>{

        let torneio = await prisma.torneios.findUnique({
            where: {
                id: id_torneio
            },
            select: {
                nome: true,
                status: {
                    select: {
                        id: true,
                        nome: true
                    }
                }
            },
        });

        if(!torneio){
            console.log("Torneio não encontrado");
            throw new AppError('Torneio não encontrado');
        }

        if(torneio.status.id >= Number(process.env.STATUS_FINALIZADO)){
            console.log("Torneio já finalizado");
            throw new AppError('Torneio já finalizado');
        }



        
        let classeTorneio = await prisma.classeTorneio.findUnique({
            where: {
                id: id_classeTorneio
            },
            select: {
                cabecasChave: true,
                classeRanking: {
                    select: {
                        classe: {
                            select: {
                                id: true,
                                nome: true
                            }
                        }
                    }
                }
            }
        });


        console.log("\nResposta: ");

        if(!classeTorneio){
            console.log("Classe de torneio não encontrada");
            throw new AppError('Classe de torneio não encontrada');
        }

        if(classeTorneio.cabecasChave === -1){
            console.log("Não há partidas para limpar");
            throw new AppError('Não há partidas para limpar');
        }



        console.log("Deletando as partidas: ");
        console.log("\tTorineio: " + torneio.nome);
        console.log("\tClasse: " + classeTorneio.classeRanking.classe.nome);


        const chave = await prisma.partidas.deleteMany({
            where: { 
                id_classeTorneio
            }
        });


        if(chave.count){
            const classeTorneio = await prisma.classeTorneio.update({
                where: {
                    id: id_classeTorneio
                },
                data: {
                    cabecasChave: -1
                }
            });

            if(!classeTorneio){
                console.log("Erro ao atualizar a classe de torneio");
                throw new AppError('Erro ao atualizar a classe de torneio');
            }
        } else{
            console.log("Erro ao deletar as partidas");
            throw new AppError('Erro ao deletar as partidas');
        }

        
        torneio = await prisma.torneios.update({
            where: {
                id: id_torneio
            },
            data: {
                id_status: Number(process.env.STATUS_INSCRICOES_ENCERRADAS)
            },
            select: {
                nome: true,
                status: {
                    select: {
                        id: true,
                        nome: true
                    }
                }
            }
        });

        if(!torneio){
            console.log("Erro ao atualizar o status do torneio");
            throw new AppError('Erro ao atualizar o status do torneio');
        }

        
        console.log("\nPartidas deletadas com sucesso");
        console.log(chave);


        return { chave, torneio };
    }
}

