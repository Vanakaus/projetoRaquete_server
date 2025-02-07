import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


export async function CreateStatus() {

  // Verifica se a tabela status ja foi criada e preenchida, caso sim, não faz nada
  const statusExists = await prisma.status.findMany();
  if (statusExists.length > 0) {
    return;
  }
  

  // ========================================================================================
  const status = [{ id: 1, status: 'Inscrições Abertas'}, { id: 2, status:'Inscrições Encerradas'}, { id: 3, status:'Jogos Sorteadas'}, { id: 4, status:'Em Andamento'}, { id: 5, status:'Finalizado'}, { id: 6, status:'Cancelado'}];
  // AO ALTERAR OS STATUS, ALTERAR TAMBEM NAS VARIÁVEIS DE AMBIENTE
  // É UTILIZADO O ID DO STATUS PARA BOQUEAR OU PERMITIR ACESSO A DETERMINADAS AÇÕES
  // ========================================================================================

  // Insere os status na tabela status
  for (let i = 0; i < status.length; i++)
    await prisma.status.create({
      data: {
        id: status[i].id,
        nome: status[i].status,
      },
    });
}



CreateStatus()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
