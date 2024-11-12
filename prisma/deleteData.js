const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const prisma = new PrismaClient();
const { exec } = require('child_process');

async function main() {

  // Limpa todas as tabelas do banco com exceção de status
  await prisma.disponibilidade.deleteMany();
  await prisma.partidas.deleteMany();
  await prisma.inscricao.deleteMany();
  await prisma.placar.deleteMany();
  await prisma.quadras.deleteMany();
  await prisma.horarios.deleteMany();

  await prisma.campeonatos.deleteMany();
  await prisma.user.deleteMany();

  // Cria o usuario admin executando o script createAdmin.js
  exec('node prisma/createAdmin.js', (err, stdout, stderr) => {
    if (err) {
      console.error('Error creating admin user');
      console.error(err);
      return;
    }
  });
}



main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
