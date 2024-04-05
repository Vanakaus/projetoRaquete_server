import { prisma } from "../../prisma/client";
import { UpdateUserDTO } from "../../interface/UsersDTO";
import { AppError } from "../../errors/AppErrors";



export class UpdateUserUseCase{
    async execute({ email, novoEmail, username, telefone, celular}: UpdateUserDTO): Promise<any>{
        
        const userExiste = await prisma.user.findFirst({
            where: { email }
        });


        if(!userExiste){
            console.log("Usuário não encontrado");
            throw new AppError('Usuário não encontrado');
        }


        if(novoEmail === null || novoEmail === undefined || novoEmail === "")
            novoEmail = email;

        
        const dadosDisponiveis = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: novoEmail },
                    { username }
                ],
                AND: { NOT: { cpf: userExiste.cpf } }
            }
        });


        
        if(dadosDisponiveis){

            if(dadosDisponiveis.email === novoEmail){
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
            where: { email },
            data: {
                email: novoEmail,
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
            console.log("Erro ao cadastrar usuário");
            console.log(user);
            throw new AppError('Erro ao cadastrar usuário\n\n\n' + user);
        }

        console.log("Usuário cadastrado com sucesso");
        console.log(user);

        return user;
    }
}