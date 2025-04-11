import { listarClassesDTO } from "../../interface/ClasseDTO";
import { prisma } from "../../prisma/client";



export class ListarClassesUseCase{
    async execute( {id_academia}: listarClassesDTO ): Promise<any>{

        const classes = await prisma.classes.findMany({
            select: {
                id: true,
                sigla: true,
                nome: true,
                masculino: true,
                misto: true,
                dupla: true
            },
            where: {
                id_academia: id_academia
            }

        });

        console.log("Resposta: ");
        console.log(classes.length + " Classes listadas com sucesso");
        
        return {classes};
    }
}