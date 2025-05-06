import { Academias } from "@prisma/client";
import { prisma } from "../../prisma/client";
import { CriaAcademiaDTO, } from "../../interface/UsersDTO";
import { AppError } from "../../errors/AppErrors";



export class CriaAcademiaUseCase{
    async execute({ id, nome }: CriaAcademiaDTO): Promise<Academias>{
        
        const academiaExiste = await prisma.academias.findFirst({
            where: {
                OR: [
                    {id},
                    {nome}
                ]
            }
        });


        if(academiaExiste){
            console.log("\nResposta: ");

            if(academiaExiste.id === id){
                console.log("ID Já cadastrado");
                throw new AppError('ID Já cadastrado');
            }

            if(academiaExiste.nome === nome){
                console.log("Nome Já cadastrado");
                throw new AppError('Nome Já cadastrado');
            
            }
        }

        
        const academia = await prisma.academias.create({
            data: {
                id,
                nome
            }
        });

        if(!academia){
            console.log("Erro ao cadastrar academia");
            console.log(academia);
            throw new AppError('Erro ao cadastrar academia\n\n\n' + academia);
        }

        console.log("Academia cadastrado com sucesso");
        console.log(academia);
        

        return academia;
    }
}