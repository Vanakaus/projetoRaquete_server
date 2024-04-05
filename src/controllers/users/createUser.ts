import { User } from "@prisma/client";
import { prisma } from "../../prisma/client";
import { CreateUserDTO } from "../../interface/UsersDTO";
import { AppError } from "../../errors/AppErrors";
import { hashSenha } from "../../services/hashPassword";



export class CreateUserUseCase{
    async execute({email, senha, nome, sobrenome, dataNascimento, username, telefone, celular}: CreateUserDTO): Promise<User>{
        
        const userExiste = await prisma.user.findFirst({
            where: {
                OR: [
                    {email},
                    {username}
                ]
            }
        });


        if(userExiste){
            console.log("\nResposta: ");

            if(userExiste.email === email){
                console.log("Email Indisponível");
                throw new AppError('Email Indisponível');
            
            }if(username !== null){
                console.log("Username Indisponível");
                throw new AppError('Username Indisponível');
            }
        }

        dataNascimento = new Date(dataNascimento);
        senha = await hashSenha(senha);
        
        const user = await prisma.user.create({
            data: {
                email,
                senha,
                nome,
                sobrenome,
                dataNascimento,
                username: username || undefined,
                telefone: telefone || undefined,
                celular: celular || undefined,
                cargo: undefined,
                rank: undefined 
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