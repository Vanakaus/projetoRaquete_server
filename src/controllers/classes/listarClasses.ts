import { prisma } from "../../prisma/client";

export class ListarClassesUseCase{
    async execute(): Promise<any>{

        const classes = await prisma.classes.findMany({
            select: {
                sigla: true,
                nome: true,
                masculino: true,
                dupla: true
            }
        });

        console.log("Resposta: ");
        console.log(classes.length + " Classes listadas com sucesso");
        
        return {classes};
    }
}