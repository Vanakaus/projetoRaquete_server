import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";
import { AbrirFecharInscricoesDTO } from "../../interface/TorneiosDTO";

export class AbreFechaInscricoesUseCase{
    async execute({id, cpf, id_criador, abreFecha}: AbrirFecharInscricoesDTO): Promise<any>{
        console.log("Cpf: ", cpf);
        console.log("Id: ", id);
        console.log("Id_criador: ", id_criador);

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

        if(campeonato.id_status !== 1 && campeonato.id_status !== 2){
            console.log("Ação indisponível");
            throw new AppError('Ação indisponível');
        }

        if(campeonato.id_status === 1 && abreFecha){
            console.log("Campeonato já está aberto");
            throw new AppError('Campeonato já está aberto');
        }

        if(campeonato.id_status === 2 && !abreFecha){
            console.log("Campeonato já está fechado");
            throw new AppError('Campeonato já está fechado');
        }

        // Atualiza o status do campeonato
        campeonato = await prisma.campeonatos.update({
            where: {
                id
            },
            data: {
                id_status: abreFecha ? 1 : 2
            },
            select: {
                id: true,
                id_criador: true,
                nome: true,
                id_status: true,
                status: {
                    select: {
                        id: true,
                        nome: true
                    }
                }
            }
        });
        
        console.log(`Campeonato ${campeonato.nome} aberto com sucesso`);

        return {campeonato};
    }
}