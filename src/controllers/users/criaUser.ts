import { User } from "@prisma/client";
import { prisma } from "../../prisma/client";
import { CriaUserDTO } from "../../interface/UsersDTO";
import { AppError } from "../../errors/AppErrors";
import { hashSenha } from "../../services/hashPassword";



export class CriaUserUseCase{
    async execute({cpf, email, senha, nome, sobrenome, dataNascimento, username, telefone, celular}: CriaUserDTO): Promise<User>{
        
        const userExiste = await prisma.user.findFirst({
            where: {
                OR: [
                    {cpf},
                    {email},
                    {username}
                ]
            }
        });


        if(userExiste){
            console.log("\nResposta: ");

            if(userExiste.cpf === cpf){
                console.log("CPF Já cadastrado");
                throw new AppError('CPF Já cadastrado');
            }

            if(userExiste.email === email){
                console.log("Email Já cadastrado");
                throw new AppError('Email Já cadastrado');
            
            }if(username !== null){
                console.log("Username Indisponível");
                throw new AppError('Username Indisponível');
            }
        }

        dataNascimento = new Date(dataNascimento);
        senha = await hashSenha(senha);
        
        const user = await prisma.user.create({
            data: {
                cpf,
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
        }) as any;

        delete user.senha;

        if(!user){
            console.log("Erro ao cadastrar usuário");
            console.log(user);
            throw new AppError('Erro ao cadastrar usuário\n\n\n' + user);
        }

        console.log("Usuário cadastrado com sucesso");
        console.log(user);
        

        delete user.sobrenome;
        delete user.dataNascimento;
        delete user.telefone;
        delete user.celular;
        delete user.rank;

        return user;
    }
}