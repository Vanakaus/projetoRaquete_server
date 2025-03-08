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


        // Verifica se o torneio existe e se as inscrições estão abertas (status torneio)
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
        const inscricoes = [];

        // Calcula a faixa de datas para buscar as pontuações dos tenistas
        const anoAtual = new Date().getFullYear();
        const inicioAno = new Date(anoAtual, 0, 1);
        const fimAno = new Date(anoAtual, 11, 31);



        // Passa por todas as inscriçõesClasse
        for (let i = 0; i < inscricaoClasse.length; i++) {

            // Variáveis de dados
            const duplas = inscricaoClasse[i].duplas;
                const id_classeTorneio = inscricaoClasse[i].id_classeTorneio;
                const sigla = await prisma.classeTorneio.findFirst({
                where: {    id: id_classeTorneio    },
                select: {   classeRanking: {    select: {   classe: {   select: {   sigla: true  }   }   }   }   }
            });
            
            // Verifica se a classe existe, caso não exista passa para a próxima
            const classeExiste = await prisma.classeTorneio.findFirst({
                where: {
                    id: id_classeTorneio
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
                        inscricoes.push({
                            jogador: jogador.nome + (duplas ? ` e ${jogador2.nome}` : ''),
                            sucesso: false,
                            repetido: false,
                            mensagem: `Erro ao cadastrar jogador 1(${jogador.nome}) no sistema`
                         });
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
                        console.log("Erro ao adicionar jogador na academia");
                        falha = true;
                        inscricoes.push({
                            jogador: jogador.nome + (duplas ? ` e ${jogador2.nome}` : ''),
                            sucesso: false,
                            repetido: false,
                            mensagem: `Erro ao adicionar jogador 1(${jogador.nome}) na academia`
                         });
                        continue;
                    }else{
                        id_tenistaAcademia = novoTenistaAcademia.id;
                    }

                } else{
                    id_tenistaAcademia = tenistaAcademiaExiste.id;
                }
                
                // Verifica se é dupla e repete o processo para o segundo jogador
                if(duplas){

                    const tenistaExiste2 = await prisma.tenistas.findFirst({
                        where: {
                            cpf: jogador2.cpf
                        }
                    });

                    if(!tenistaExiste2){
                        const novoTenista2 = await prisma.tenistas.create({
                            data: {
                                cpf: jogador2.cpf,
                                nome: jogador2.nome
                            }
                        });

                        if(!novoTenista2){
                            console.log("Erro ao cadastrar novo jogador");
                            falha = true;
                            inscricoes.push({
                                jogador: jogador.nome + (duplas ? ` e ${jogador2.nome}` : ''),
                                sucesso: false,
                                repetido: false,
                                mensagem: `Erro ao cadastrar jogador 2(${jogador2.nome}) no sistema`
                            });
                            continue;
                        }
                    }
                    

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
                            console.log("Erro ao adicionar jogador na academia");
                            falha = true;
                            inscricoes.push({
                                jogador: jogador.nome + (duplas ? ` e ${jogador2.nome}` : ''),
                                sucesso: false,
                                repetido: false,
                                mensagem: `Erro ao adicionar jogador 2(${jogador2.nome}) na academia`
                            });
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
                        tenistasInscricao: {
                            some: {
                                OR: [
                                    { id_tenistaAcademia: id_tenistaAcademia },
                                    { id_tenistaAcademia: id_tenistaAcademia2 }
                                ]
                            }
                        },
                    },
                    select: {
                        id: true,
                        tenistasInscricao: {
                            select: { id_tenistaAcademia: true, },
                            where: { 
                                OR: [
                                    { id_tenistaAcademia: id_tenistaAcademia },
                                    { id_tenistaAcademia: id_tenistaAcademia2 }
                                ]
                            }
                        }
                    }
                });


                if(inscricaoExiste){
                    if(duplas){

                        // Caso seja dupla, verifica se a dupla já está inscrita na classe, ou se apenas um dos jogadores já está inscrito
                        if(inscricaoExiste.tenistasInscricao.length === 1){
                            if(inscricaoExiste.tenistasInscricao[0].id_tenistaAcademia === id_tenistaAcademia){
                                console.log("Jogador 1 já inscrito no torneio");
                                sucesso = true;
                                inscricoes.push({
                                    jogador: jogador.nome + (duplas ? ` e ${jogador2.nome}` : ''),
                                    sucesso: true,
                                    repetido: true,
                                    mensagem: `Jogador 1 já inscrito no torneio`
                                });
                            }
                            if(inscricaoExiste.tenistasInscricao[0].id_tenistaAcademia === id_tenistaAcademia2){
                                console.log("Jogador 2 já inscrito no torneio");
                                sucesso = true;
                                inscricoes.push({
                                    jogador: jogador.nome + (duplas ? ` e ${jogador2.nome}` : ''),
                                    sucesso: true,
                                    repetido: true,
                                    mensagem: `Jogador 2 já inscrito no torneio`
                                });
                            }
                        }else if(inscricaoExiste.tenistasInscricao.length === 2){
                            console.log("Dupla já inscrita no torneio");
                            sucesso = true;
                            inscricoes.push({
                                jogador: jogador.nome + (duplas ? ` e ${jogador2.nome}` : ''),
                                sucesso: true,
                                repetido: true,
                                mensagem: `Dupla já inscrita no torneio`
                            });
                        }

                    }else{
                        console.log("Jogador já inscrito no torneio");
                        sucesso = true;
                        inscricoes.push({
                            jogador: jogador.nome + (duplas ? ` e ${jogador2.nome}` : ''),
                            sucesso: true,
                            repetido: true,
                            mensagem: `Jogador já inscrito no torneio`
                        });
                    }
                    continue;
                }


                // Cria a inscrição
                const novaInscricao = await prisma.inscricao.create({
                    data: {
                        id_classeTorneio
                    }
                });

                if(!novaInscricao){
                    console.log("Erro ao cadastrar inscrição");
                    falha = true;
                    inscricoes.push({
                        jogador: jogador.nome + (duplas ? ` e ${jogador2.nome}` : ''),
                        sucesso: false,
                        repetido: false,
                        mensagem: `Erro adicionar inscrição`
                    });
                    continue;
                }

                // Adiciona os tenistas à inscrição
                let novaInscricaoTenista;
                if(duplas){
                    novaInscricaoTenista = await prisma.tenistasInscricao.createMany({
                        data: [
                            { id_inscricao: novaInscricao.id, id_tenistaAcademia, ordem: 1 },
                            { id_inscricao: novaInscricao.id, id_tenistaAcademia: id_tenistaAcademia2, ordem: 2 }
                        ]
                    });
                }else{
                    novaInscricaoTenista = await prisma.tenistasInscricao.create({
                        data: {
                            id_inscricao: novaInscricao.id, id_tenistaAcademia, ordem: 1
                        }
                    });
                }

                if(!novaInscricaoTenista){
                    console.log(`Erro ao adicionar ${duplas ? 'dupla' : 'tenista'} à inscrição`);

                    await prisma.inscricao.delete({
                        where: { id: novaInscricao.id }
                    });

                    falha = true;
                    inscricoes.push({
                        jogador: jogador.nome + (duplas ? ` e ${jogador2.nome}` : ''),
                        sucesso: false,
                        repetido: false,
                        mensagem: `Erro adicionar ${duplas ? 'dupla' : 'tenista'} à inscrição`
                    });
                    continue;
                }


                const pontuacao = await prisma.pontuacaoRanking.findMany({
                    where: {
                        OR: [
                            {inscricao: {   tenistasInscricao: {  some: { id_tenistaAcademia }   }   }},
                            {inscricao: {   tenistasInscricao: {  some: { id_tenistaAcademia: id_tenistaAcademia2 }   }   }}
                        ],
                        data: { gte: inicioAno, lte: fimAno }
                    },
                    select: {
                        pontuacao: true
                    },
                });

                sucesso = true;
                inscricoes.push({
                    jogador: jogador.nome + (duplas ? ` e ${jogador2.nome}` : ''),
                    sucesso: true,
                    repetido: false,
                    mensagem: `Inscrição adicionada com sucesso`,
                    pontuacao: pontuacao.reduce((acc, cur) => acc + cur.pontuacao, 0),
                    siglaClasse: sigla?.classeRanking.classe.sigla
                });
            }
        }


        console.log("\n\n");
        console.log(`${inscricoes.reduce((acc, cur) => acc + (cur.sucesso && !cur.repetido ? 1 : 0), 0)} inscrições realizadas com sucesso`);
        console.log(`${inscricoes.reduce((acc, cur) => acc + (cur.repetido ? 1 : 0), 0)} inscrições repetidas`);
        console.log(`${inscricoes.reduce((acc, cur) => acc + (cur.sucesso ? 0 : 1), 0)} inscrições com falha`);        

        return { sucesso, falha, inscricoes };
    }
}