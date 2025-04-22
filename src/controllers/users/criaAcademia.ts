import { Academias } from "@prisma/client";
import { prisma } from "../../prisma/client";
import { CriaAcademiaDTO, } from "../../interface/UsersDTO";
import { AppError } from "../../errors/AppErrors";



export class CriaAcademiaUseCase{
    async execute({ id, nome, telefone }: CriaAcademiaDTO): Promise<Academias>{
        
        const academiaExiste = await prisma.academias.findFirst({
            where: {
                OR: [
                    {id},
                    {nome},
                    {telefone}
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
            
            }if(academiaExiste.telefone === telefone && telefone.length > 2){
                console.log("Telefone Indisponível");
                throw new AppError('Telefone Indisponível');
            }
        }

        
        const academia = await prisma.academias.create({
            data: {
                id,
                nome,
                telefone
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