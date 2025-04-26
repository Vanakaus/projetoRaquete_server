import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppErrors";
import { ListaTorneiosStatusAcademiaDTO } from "../../interface/TorneiosDTO";

export class ListarTorneiosStatusAcademiaUseCase{
    async execute({ id_academia }: ListaTorneiosStatusAcademiaDTO): Promise<any>{

        console.log("Contando a quuantidade de torneios por status da Academia: " + id_academia);

        // Busca e verifica se o status existe
        const status = await prisma.status.findMany({
            select: { id: true, nome: true }
        }) as any;

        console.log("\nResposta: ");

        if (!status) {
            console.log("Erro ao listar os torneios por status");
            throw new AppError("Erro ao listar os torneios por status", 404);
        }

        // Conta a quantidade de torneios por status
        for( const statusItem of status) {
            const torneios = await prisma.torneios.count({
                where: {
                    id_academia,
                    id_status: statusItem.id
                }
            });
            statusItem.torneios = torneios;
        }

        console.log("Torneios contados com sucesso: " + status.reduce((acc: any, statusItem: any ) => acc + statusItem.torneios, 0));
        
        return {torneiosStatus: status};
    }
}