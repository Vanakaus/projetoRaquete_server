import { Inscricao, User } from "@prisma/client";
import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";
import { CreateInscricaoDTO } from "../../interface/InscricaoUsersDTO";



export class CreateInscricaoUseCase{
    async execute({id_campeonato, id_jogador}: CreateInscricaoDTO): Promise<Inscricao>{
        
        const userInscrito = await prisma.inscricao.findUnique({
            where: {
                id_campeonato,
                id_jogador
            }
        });

        console.log("\nResposta: ");

        if(userInscrito){
            console.log("Usuário já inscrito no campeonato");
            throw new AppError('Usuário já inscrito no campeonato');
        }
        
        
        const inscricao = await prisma.inscricao.create({
            data: {
                id_campeonato,
                id_jogador,
                dataInscricao: new Date()
            }
        });


        if(!inscricao){
            console.log("Erro ao cadastrar usuário");
            console.log(inscricao);
            throw new AppError('Erro ao cadastrar usuário\n\n\n' + inscricao);
        }

        console.log("Inscrição realizada com sucesso");
        console.log(inscricao);
        

        return inscricao;
    }
}