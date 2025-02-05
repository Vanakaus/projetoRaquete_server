import { User } from "@prisma/client";
import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";
import { CriaClasseDTO } from "../../interface/ClasseDTO";



export class CriarClasseUseCase{
    async execute({ id_academia, sigla, nome, masculino, misto, dupla }: CriaClasseDTO): Promise<User>{
        
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


        if(classeExiste){
            console.log("\nResposta: ");

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
                academia: {
                    connect: { id: id_academia }
                }
            }
        }) as any;

        if(!classe){
            console.log("Erro ao cadastrar classe");
            console.log(classe);
            throw new AppError('Erro ao cadastrar classe\n\n\n' + classe);
        }

        console.log("Usuário cadastrado com sucesso");
        console.log(classe);
        

        return {classe} as any;
    }
}