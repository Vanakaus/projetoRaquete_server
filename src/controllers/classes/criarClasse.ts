import { User } from "@prisma/client";
import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";
import { CriaClasseDTO } from "../../interface/ClasseDTO";



export class CriarClasseUseCase{
    async execute({ id_academia, id_ranking, sigla, nome, masculino, misto, dupla }: CriaClasseDTO): Promise<any> {
        
        const classeExiste = await prisma.classes.findFirst({
            where: {
                AND: [
                    {id_academia},
                    {OR: [
                            {sigla},
                            {nome}
                    ]}
                ]
            }
        });

        
        console.log("\nResposta: ");

        if(classeExiste){

            if(classeExiste.sigla === sigla){
                console.log("Sigla Já cadastrada");
                throw new AppError('Sigla Já cadastrada');
            }

            if(classeExiste.nome === nome){
                console.log("Nome Já cadastrado");
                throw new AppError('Nome Já cadastrado');
            }
        }

        
        const classe = await prisma.classes.create({
            data: {
                sigla,
                nome,
                masculino,
                misto,
                dupla,
                id_academia
            }
        });

        if(!classe){
            console.log("Erro ao cadastrar classe");
            console.log(classe);
            throw new AppError('Erro ao cadastrar classe\n\n\n' + classe);
        }

        if(id_ranking){
            await prisma.classeRanking.create({
                data: {
                    id_classe: classe.id,
                    id_ranking 
                }
            });
        }

        console.log("Classe cadastrada com sucesso");
        console.log(classe);
        

        return {classe};
    }
}