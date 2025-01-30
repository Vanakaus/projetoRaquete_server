const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const prisma = new PrismaClient();
const { exec } = require('child_process');

async function main() {

  // Limpa todas as tabelas do banco com exceção de status
  await prisma.sets.deleteMany();
  await prisma.partidas.deleteMany();

  await prisma.inscricao.deleteMany();
  
  await prisma.classeTorneio.deleteMany();
  await prisma.torneios.deleteMany();
  await prisma.pontuacoesCampeonato.deleteMany();
  await prisma.status.deleteMany();

  await prisma.tenistas.deleteMany();
  
  await prisma.classeRanking.deleteMany();
  await prisma.ranking.deleteMany();
  await prisma.classes.deleteMany();
  await prisma.academias.deleteMany();
  
  await prisma.user.deleteMany();

//   // Cria o usuario admin executando o script createAdmin.js
//   exec('node prisma/createAdmin.js', (err, stdout, stderr) => {
//     if (err) {
//       console.error('Error creating admin user');
//       console.error(err);
//       return;
//     }
//   });

// // Cria a tabela status atraves do script createStatus.js
// exec('node prisma/createStatus.js', (err, stdout, stderr) => {
//   if (err) {
//     console.error('Error creating status table');
//     console.error(err);
//     return;
//   }
// });
}



main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
