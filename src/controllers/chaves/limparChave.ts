import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";
import { LimparChaveDTO } from "../../interface/ChavesDTO";



export class LimparChaveUseCase{
    async execute({cpf, id_jogador, id_campeonato}: LimparChaveDTO): Promise<any>{

        if(cpf !== id_jogador){
            console.log("CPF não corresponde ao token");
            throw new AppError('CPF não corresponde ao token\nRefaça o login');
        }
        
        
        const campeonato = await prisma.campeonatos.findUnique({
            where: {
                id: id_campeonato
            }
        });


        console.log("\nResposta: ");

        if(!campeonato){
            console.log("Campeonato não encontrado");
            throw new AppError('Campeonato não encontrado\n\n\n' + campeonato);
        }


        if(campeonato.id_criador !== id_jogador){
            console.log("Você não é o dono do campeonato");
            throw new AppError('Você não é o dono do campeonato\n\n\n' + campeonato);
        }


        // if(campeonato.status !== 'Chaves Geradas'){
        //     console.log("Não é possível gerar chave \nCampeonato Status: " + campeonato.status);
        //     throw new AppError('Não é possível gerar chave \nCampeonato Status: ' + campeonato.status);
        // }


1
        console.log("Deletando inscrições do campeonato: ");
        console.log("\tID: " + id_campeonato);
        console.log("\tNome: " + campeonato.nome);
        const inscricoes = await prisma.partidas.deleteMany({
            where: {
                id_campeonato
            }
        });

        
        console.log("\n\nInscrições deletadas com sucesso");
        console.log(inscricoes);
        console.log("\n\n");


        return inscricoes;
    }
}

