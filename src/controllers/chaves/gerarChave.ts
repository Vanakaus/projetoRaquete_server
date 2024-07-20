import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";
import { GerarChaveDTO } from "../../interface/ChavesDTO";



export class GerarChaveUseCase{
    async execute({cpf, id_jogador, id_campeonato}: GerarChaveDTO): Promise<any>{

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


        // if(campeonato.status !== 'Inscrições encerradas'){
        //     console.log("Não é possível gerar chave \nCampeonato Status: " + campeonato.status);
        //     throw new AppError('Não é possível gerar chave \nCampeonato Status: ' + campeonato.status);
        // }



        // Busca todos os incritos no campeonato por ordem do rank do jogador
        const inscricoes = await prisma.inscricao.findMany({
            select: {
                id: true,
                id_campeonato: true,
                id_jogador: true,
                dataInscricao: true,
                jogador: {
                    select: {
                        username: true,
                        nome: true,
                        sobrenome: true,
                        rank: true
                    }
                }
            },
            where: {
                id_campeonato
            },
            orderBy: {
                jogador: {
                    rank: 'desc'
                }
            }
        });

        const qtdInscritos = inscricoes.length;
        let qtdPartidas = 2;

        for(qtdPartidas; qtdPartidas < qtdInscritos; qtdPartidas = qtdPartidas * 2);


        console.log("Resposta: ");
        console.log("Quantidade de inscritos no campeonato: " + qtdInscritos);
        console.log("Quantidade total de inscritos possíveis: " + qtdPartidas--);

        // console.log("/n/nInsrcrições: ");
        // console.log(inscricoes);
        console.log("\n\n");


        console.log("\nChaves: ");
        for(let i = 0; i < qtdPartidas/2; i++){

            const chave = formataNumero((qtdPartidas + 1) / 2) + ":" + formataNumero(i + 1);

            // console.log("Chave: ", chave);
            // console.log("\tJogador 1:");
            // console.log("\t\tID: " + inscricoes[i].id);
            // console.log("\t\tApelido: " + inscricoes[i].jogador.username);
            // console.log("\t\tNome: " + inscricoes[i].jogador.nome + " " + inscricoes[i].jogador.sobrenome);
            // console.log("\t\tRank: " + inscricoes[i].jogador.rank);


            if(qtdPartidas - i < qtdInscritos){

                // console.log("\tJogador 2:");
                // console.log("\t\tID: " + inscricoes[qtdPartidas - i].id);
                // console.log("\t\tApelido: " + inscricoes[qtdPartidas - i].jogador.username);
                // console.log("\t\tNome: " + inscricoes[qtdPartidas - i].jogador.nome + " " + inscricoes[qtdPartidas - i].jogador.sobrenome);
                // console.log("\t\tRank: " + inscricoes[qtdPartidas - i].jogador.rank);


                const partida = await prisma.partidas.create({
                    data: {
                        id_campeonato,
                        chave,
                        id_jogador1: inscricoes[i].id,
                        id_jogador2: inscricoes[qtdPartidas - i].id
                    }
                });
            } else {

                // console.log("\tJogador 2:");
                // console.log("\t\tID: ");
                // console.log("\t\tApelido: ");
                // console.log("\t\tNome: ");
                // console.log("\t\tRank: ");


                const partida = await prisma.partidas.create({
                    data: {
                        id_campeonato,
                        chave,
                        id_jogador1: inscricoes[i].id,
                        id_vencedor: inscricoes[i].id
                    }
                });
            }
            // console.log("\n\n");
        }


        const partidas = await prisma.partidas.findMany({
            where: {
                id_campeonato
            }
        });

        console.log("\n\nChaves geradas com sucesso: ", partidas.length);


        return partidas;
    }
}



function formataNumero(numero: number){
    return numero < 10 ? '0' + numero : numero;
}