const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const prisma = new PrismaClient();

async function main() {

  // Verifica se a tabela status ja foi criada e preenchida, caso sim, não faz nada
  const statusExists = await prisma.status.findMany();
  if (statusExists.length > 0) {
    return;
  }
  
  // Insere os status na tabela status
  const status = ['Inscrições Abertas', 'Inscrições Encerradas', 'Jogos Sorteadas', 'Em Andamento', 'Finalizado', 'Cancelado'];

  for (let i = 0; i < status.length; i++)
    await prisma.status.create({
      data: {
        id: i + 1,
        nome: status[i],
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
