import { prisma } from "../../prisma/client";
import { UpdateUserDTO } from "../../interface/UsersDTO";
import { AppError } from "../../errors/AppErrors";



export class UpdateUserUseCase{
    async execute({ cpf, email, novoEmail, username, telefone, celular}: UpdateUserDTO): Promise<any>{
        
        const userExiste = await prisma.user.findFirst({
            where: {
                AND: {
                    cpf,
                    email
                }
            }
        });


        if(!userExiste){
            console.log("Usuário não encontrado");
            throw new AppError('Usuário não encontrado');
        }


        if(novoEmail !== null && novoEmail !== undefined && novoEmail !== "" && novoEmail !== '')
            novoEmail = email;

        
        const dadosDisponiveis = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { username }
                ],
                AND: { NOT: { cpf: userExiste.cpf } }
            }
        });


        
        if(dadosDisponiveis){

            if(dadosDisponiveis.email === email){
                console.log("Email indisponível");
                throw new AppError('Email indisponível');
            }

            if(dadosDisponiveis.username === username){
                console.log("Username indisponível");
                throw new AppError('Username indisponível');
            }
        }

        
        
        if(username === "")
            username = null;


        const user = await prisma.user.update({
            where: { cpf },
            data: {
                email,
                username,
                telefone,
                celular
            },
            select: {
                email: true,
                nome: true,
                sobrenome: true,
                username: true,
                telefone: true,
                celular: true,
            }
        });
        

        if(!user){
            console.log("Erro ao atualizar dados do usuário");
            console.log(user);
            throw new AppError('Erro ao atualizar dados do usuário\n\n\n' + user);
        }

        console.log("Dados atualizado com sucesso");
        console.log(user);

        return user;
    }
}