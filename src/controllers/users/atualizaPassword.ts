import { prisma } from "../../prisma/client";
import { AtualizaPasswordDTO } from "../../interface/UsersDTO";
import { AppError } from "../../errors/AppErrors";
import { hashSenha, verificaSenha } from "../../services/hashPassword";



export class AtualizaPasswordUseCase{
    async execute({ cpf, email, senha, novaSenha}: AtualizaPasswordDTO): Promise<any>{
        
        const userExiste = await prisma.user.findFirst({
            where: {
                AND: {
                    cpf,
                    email
                }
            }
        });


        console.log("Resposta: ");

        if(!userExiste){
            console.log("Usuário não encontrado");
            throw new AppError('Usuário não encontrado');
        }

        if(!await verificaSenha(senha, userExiste.senha)){
            console.log("Senha incorreta");
            throw new AppError('Senha incorreta');
        }

        if(await verificaSenha(novaSenha, userExiste.senha)){
            console.log("Senhas igual a anterior");
            throw new AppError('Senha igual a anterior');
        }
        

        novaSenha = await hashSenha(novaSenha);

        const user = await prisma.user.update({
            where: { cpf },
            data: {
                senha: novaSenha
            },
            select: {
                username: true,
                nome: true,
                sobrenome: true,
                email: true
            }
        });

        if(!user){
            console.log("Erro ao atualizar senha");
            console.log(user);
            throw new AppError('Erro ao atualizar senha');
        }

        console.log("Senha atualizada com sucesso");
        console.log(user);


        return user;
    }
}