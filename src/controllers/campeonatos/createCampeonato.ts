import { User } from "@prisma/client";
import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";
import { CreateCampeonatoDTO } from "../../interface/CampeonatoUsersDTO";



export class CreateCampeonatoUseCase{
    async execute({cpf, nome, descricao, regras, classe, numJogadores, premiacao, local, dataInicio, dataFim}: CreateCampeonatoDTO): Promise<User>{


        // Busca todos os campeonatos que tenham o nome do novo campeonato dentro do nome deles
        const campeonatoExiste = await prisma.campeonatos.findMany({
            where: {
                nome: {
                    contains: nome
                }
            }
        });


        console.log("\nResposta: ");

        if(campeonatoExiste.length > 0){
            // if(campeonatoExiste.length > 1){
            //     var num = (+campeonatoExiste[campeonatoExiste.length - 1].nome.split(" - ")[1]);
            //     nome = nome + " - " + ((+campeonatoExiste[campeonatoExiste.length - 1].nome.split(" - ")[1]) + 1);
            // } else
            //     nome = nome + " - 2";



            console.log("Nome de campeonato indisponível");
            throw new AppError('Nome de campeonato indisponível');
        }

        dataInicio = new Date(dataInicio);
        dataFim = new Date(dataFim);

        
        const campeonato = await prisma.campeonatos.create({
            data: {
                id_criador: cpf,
                nome,
                descricao,
                regras,
                classe,
                numJogadores,
                premiacao,
                local,
                dataInicio,
                dataFim
            }
        }) as any;
        

        if(!campeonato){
            console.log("Erro ao criar campeonato");
            console.log(campeonato);
            throw new AppError('Erro ao criar campeonato\n\n\n' + campeonato);
        }

        console.log("Campeonato criado com sucesso");
        console.log(campeonato);
        

        delete campeonato.id_criador;
        delete campeonato.id;

        return campeonato;
    }
}