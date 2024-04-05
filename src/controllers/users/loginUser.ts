import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";
import { LoginUserDTO } from "../../interface/UsersDTO";
import { hashSenha, verifcaSenha } from "../../services/hashPassword";

export class LoginUserUseCase{
    async execute({email, senha}: LoginUserDTO){

        const user = await prisma.user.findFirst({
            where: {
                email
            }
        });

        if(!user){
            console.log("Usuário não encontrado");
            throw new AppError('Usuário não encontrado');
        }

        if(!await verifcaSenha(senha, user.senha)){
            console.log("Senha incorreta");
            throw new AppError('Senha incorreta');
        }

        console.log("Usuário logado com sucesso");
        console.log(user);
        return user;

        
    }
}