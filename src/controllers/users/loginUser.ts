import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";
import { LoginUserDTO } from "../../interface/UsersDTO";
import { verificaSenha } from "../../services/hashPassword";

export class LoginUserUseCase{
    async execute({email, senha}: LoginUserDTO){

        const user = await prisma.user.findFirst({
            where: { email },
            select: {
                cpf: true,
                username: true,
                nome: true,
                sobrenome: false,
                email: false,
                senha: false,
                dataNascimento: false,
                telefone: true,
                celular: true,
                cargo: true,
                rank: false
            }
        });


        if(!user){
            console.log("Usuário não encontrado");
            throw new AppError('Email incorreto');
        }

        const userSenha = await prisma.user.findFirst({
            where: { email },
            select: { senha: true }
        });


        if (userSenha && !await verificaSenha(senha, userSenha.senha)) {
            console.log("Senha incorreta");
            throw new AppError('Senha incorreta');
        }

        console.log("Login efetuado com sucesso");
        console.log(user);
        return user;        
    }
}