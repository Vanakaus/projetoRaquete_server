const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const prisma = new PrismaClient();

async function main() {

  // Limpa a tabela status e recria os status
  const status = ['Inscrições Abertas', 'Inscrições Encerradas', 'Jogos Sorteadas', 'Em Andamento', 'Finalizado', 'Cancelado'];

  const statusCount = await prisma.status.count();
  if (statusCount > 0)
    await prisma.status.deleteMany();
  
  for (statusName of status)
    await prisma.status.create({
      data: {
        nome: statusName,
      },
    });
}



main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
