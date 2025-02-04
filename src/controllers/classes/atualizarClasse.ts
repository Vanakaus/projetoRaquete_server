import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";
import { AtualizarClasseDTO } from "../../interface/ClasseDTO";



export class AtualizarClasseUseCase{
    async execute({ sigla_original, sigla, nome, masculino, misto, dupla}: AtualizarClasseDTO): Promise<any>{
        console.log("Atualizando classe");
        console.log({sigla_original, sigla, nome, masculino, dupla});
        
        const classeExiste = await prisma.classes.findFirst({
            where: {
                sigla: sigla_original
            }
        });


        if(!classeExiste){
            console.log("Classe não encontrada");
            throw new AppError('Classe não encontrada', 401);
        }


        let siglaExiste;

        if(sigla !== sigla_original){
            siglaExiste = await prisma.classes.findFirst({
                where: {
                    sigla
                }
            });

            if(siglaExiste){
                console.log("Sigla indisponível");
                throw new AppError('Sigla indisponível', 409); 
            }
        }
        

        if(classeExiste.nome !== nome){
            const nomeExiste = await prisma.classes.findFirst({
                where: {
                    nome
                }
            });

            if(nomeExiste){
                console.log("Nome indisponível");
                throw new AppError('Nome indisponível', 409); 
            }
        }


        const classe = await prisma.classes.update({
            where: { sigla: sigla_original },
            data: {
                sigla,
                nome,
                masculino,
                misto,
                dupla
            },
            select: {
                sigla: true,
                nome: true,
                masculino: true,
                misto: true,
                dupla: true
            }
        });


        if(!classe){
            console.log("Erro ao atualizar dados da classe");
            console.log(classe);
            throw new AppError('Erro ao atualizar dados da classe\n\n\n' + classe, 500);
        }
        

        console.log("Classe atualizada com sucesso");
        console.log(classe);

        return {classe};
    }
}