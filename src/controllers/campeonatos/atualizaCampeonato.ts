import { User } from "@prisma/client";
import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";
import { AtualizaCampeonatoDTO } from "../../interface/TorneiosDTO";



export class AtualizaCampeonatoUseCase{
    async execute({cpfToken, id, id_criador, nome, descricao, regras, classe, numJogadores, premiacao, sets, local, dataInicio, dataFim}: AtualizaCampeonatoDTO): Promise<User>{

        if(cpfToken !== id_criador){
            console.log("CPF não corresponde ao token");
            throw new AppError('CPF não corresponde ao token\nRefaça o login');
        }


        // Busca todos os campeonatos que tenham o nome do novo campeonato dentro do nome deles
        const campeonatoExiste = await prisma.campeonatos.findMany({
            where: {
                id
            }
        });


        console.log("\nResposta: ");

        if(campeonatoExiste.length === 0){
            console.log("Campeonato não encontrado");
            throw new AppError('Campeonato não encontrado');
        }


        dataInicio = new Date(dataInicio);
        dataFim = new Date(dataFim);

        
        const campeonato = await prisma.campeonatos.update({
            where: {
                id
            },
            data: {
                nome,
                descricao,
                regras,
                classe,
                numJogadores,
                premiacao,
                sets,
                local,
                dataInicio,
                dataFim
            }
        }) as any;
        

        if(!campeonato){
            console.log("Erro ao atualizar campeonato");
            console.log(campeonato);
            throw new AppError('Erro ao atualizar campeonato\n\n\n' + campeonato);
        }

        console.log("Campeonato atualizado com sucesso");
        console.log(campeonato);
        

        delete campeonato.id_criador;
        delete campeonato.id;

        return campeonato;
    }
}