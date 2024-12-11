import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";
import { LoginUserDTO } from "../../interface/UsersDTO";
import { verificaSenha } from "../../services/hashPassword";
import crypto from 'crypto';

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


        if (!process.env.SECRET_KEY || !process.env.SECRET_IV) 
            throw new AppError('Erro na autenticação\nFavor entrar em contato com o suporte');

        try {
            const decipher = crypto.createDecipheriv('aes-128-cbc', process.env.SECRET_KEY, process.env.SECRET_IV);
            senha = decipher.update(senha, 'hex', 'utf8');
            senha += decipher.final('utf8');
        } catch (error) {
            throw new AppError('Erro na autenticação\nFavor entrar em contato com o suporte');
        }


        if (userSenha && !await verificaSenha(senha, userSenha.senha)) {
            console.log("Senha incorreta");
            throw new AppError('Senha incorreta');
        }

        console.log("Login efetuado com sucesso");
        console.log(user);
        return user;        
    }
}