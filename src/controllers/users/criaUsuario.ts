import { prisma } from "../../prisma/client";
import { CriaUsuarioDTO } from "../../interface/UsersDTO";
import { AppError } from "../../errors/AppErrors";
import { hashSenha } from "../../services/hashPassword";



export class CriaUsuarioUseCase{
    async execute({login, nome, senha, id_academia}: CriaUsuarioDTO): Promise<any>{
        
        const userExiste = await prisma.user.findFirst({
            where: {
                OR: [
                    {login},
                    {nome},
                ]
            }
        });


        if(userExiste){
            console.log("\nResposta: ");

            if(userExiste.login === login){
                console.log("Login Já cadastrado");
                throw new AppError('Login Já cadastrado');
            }

            if(userExiste.nome === nome){
                console.log("Nome Já cadastrado");
                throw new AppError('Nome Já cadastrado');
            }
        }


        const academiaExiste = await prisma.academias.findFirst({
            where: { id: id_academia }
        });

        if(!academiaExiste){
            console.log("Academia não encontrada");
            throw new AppError('Academia não encontrada');
        }


        senha = await hashSenha(senha);
        
        const user = await prisma.user.create({
            data: {
                login,
                nome,
                senha,
                id_academia
            },
            select: {
                login: true,
                nome: true,
                senha: false,
                id_academia: true,
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