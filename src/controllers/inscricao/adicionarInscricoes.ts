import { Inscricao } from "@prisma/client";
import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";
import { AdicionarInscricoesDTO } from "../../interface/InscricaoUsersDTO";



export class AdicionarInscricoesUseCase{
    async execute({ id_academia, id_torneio, inscricaoClasse }:AdicionarInscricoesDTO): Promise<any>{


        console.log("Resposta: ");

        // Verifica se a academia existe
        const academiaExiste = await prisma.academias.findFirst({
            where: {
                id: id_academia
            }
        });

        if(!academiaExiste){
            console.log("Academia não encontrada");
            new AppError('Erro ao realizar inscrição');
        }


        // Verifica se o torneio existe e se as inscrições estão abertas (status campeonato)
        const torneioExiste = await prisma.torneios.findFirst({
            where: {
                id: id_torneio
            },
            select: {
                status: true
            }
        });

        if(!torneioExiste){
            console.log("Torneio não encontrado");
            new AppError('Erro ao realizar inscrição');
        } else if(torneioExiste.status.id >= Number(process.env.STATUS_INSCRICOES_ENCERRADAS)){
            console.log("Inscrições fechadas");
            new AppError('Erro ao realizar inscrição');
        }


        // Variáveis de controle de mesnsagem de resposta
        let falha = false;
        let sucesso = false;

        // Passa por todas as inscriçõesClasse
        for (let i = 0; i < inscricaoClasse.length; i++) {

            // Variáveis de dados
            const duplas = inscricaoClasse[i].duplas;

            
            // Verifica se a classe existe, caso não exista passa para a próxima
            const classeExiste = await prisma.classeTorneio.findFirst({
                where: {
                    id: inscricaoClasse[i].id_classeTorneio
                }
            });

            if(!classeExiste){
                console.log("Classe não encontrada");
                falha = true;
                continue;
            }
            

            // Passa por todos os jogadores inscritos na classe
            for (let j = 0; j < inscricaoClasse[i].inscricaoJogador.length; duplas ? j+=2 : j++) {
                
                // Variaveis de dados
                const jogador = inscricaoClasse[i].inscricaoJogador[j];
                const jogador2 = inscricaoClasse[i].inscricaoJogador[j+1];
                const id_classeTorneio = inscricaoClasse[i].id_classeTorneio;
                let id_tenistaAcademia = 0;
                let id_tenistaAcademia2 = 0;


                // Verifica se o jogador existe, caso não exista tenta cadastrar, caso não consiga passa para o próximo
                const tenistaExiste = await prisma.tenistas.findFirst({
                    where: {
                        cpf: jogador.cpf
                    }
                });

                if(!tenistaExiste){
                    const novoTenista = await prisma.tenistas.create({
                        data: {
                            cpf: jogador.cpf,
                            nome: jogador.nome
                        }
                    });

                    if(!novoTenista){
                        console.log("Erro ao cadastrar novo jogador");
                        falha = true;
                        continue;
                    }
                }



                // Verifica se o jogador/dupla já está inscrito na academia, caso não esteja tenta cadastrar, caso não consiga passa para o próximo
                const tenistaAcademiaExiste = await prisma.tenistasAcademias.findFirst({
                    where: {
                        id_tenista: jogador.cpf,
                        id_academia
                    }
                });


                if(!tenistaAcademiaExiste){
                    const novoTenistaAcademia = await prisma.tenistasAcademias.create({
                        data: {
                            id_tenista: jogador.cpf,
                            id_academia
                        }
                    });

                    if(!novoTenistaAcademia){
                        console.log("Erro ao cadastrar jogador na academia");
                        falha = true;
                        continue;
                    }else{
                        id_tenistaAcademia = novoTenistaAcademia.id;
                    }

                } else{
                    id_tenistaAcademia = tenistaAcademiaExiste.id;
                }
                
                // Verifica se é dupla e repete o processo para o segundo jogador
                if(duplas){
                    const tenistaAcademiaExiste2 = await prisma.tenistasAcademias.findFirst({
                        where: {
                            id_tenista: jogador2.cpf,
                            id_academia
                        }
                    });

                    if(!tenistaAcademiaExiste2){
                        const novoTenistaAcademia2 = await prisma.tenistasAcademias.create({
                            data: {
                                id_tenista: jogador2.cpf,
                                id_academia
                            }
                        });

                        if(!novoTenistaAcademia2){
                            console.log("Erro ao cadastrar jogador na academia");
                            falha = true;
                            continue;
                        } else{
                            id_tenistaAcademia2 = novoTenistaAcademia2.id;
                        }

                    } else{
                        id_tenistaAcademia2 = tenistaAcademiaExiste2.id;
                    }
                }



                // Verifica se o jogador/dupla já está inscrito na classe, caso não esteja tenta cadastrar, caso não consiga passa para o próximo
                const inscricaoExiste = await prisma.inscricao.findFirst({
                    where: {
                        id_classeTorneio,
                        id_tenistaAcademia,
                        id_tenistaAcademia2: duplas ? id_tenistaAcademia2 : null
                    }
                });


                if(inscricaoExiste){
                    console.log("Inscrição já realizada");
                    sucesso = true;
                    continue;
                }


                // Cria a inscrição
                const novaInscricao = await prisma.inscricao.create({
                    data: {
                        id_classeTorneio,
                        id_tenistaAcademia: id_tenistaAcademia,
                        id_tenistaAcademia2: duplas ? id_tenistaAcademia2 : null,
                    }
                });

                if(!novaInscricao){
                    console.log("Erro ao cadastrar inscrição");
                    falha = true;
                    continue;
                }else{
                    sucesso = true;
                }
            }
        }


        console.log (sucesso ? 
                        falha ?
                            "Inscrições realizadas com falhas"
                            : "Inscrições realizadas com sucesso"
                    : "Erro ao realizar inscrições");
        

        return { sucesso, falha };
    }
}