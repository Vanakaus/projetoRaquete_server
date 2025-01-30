const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const { genSalt } = require('bcryptjs');
const { hash } = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {

  // Verifica se o usuario admin ja foi criado, caso sim, não faz nada
  const adminExists = await prisma.user.findUnique({
    where: {
      login: 'admin',
    },
  });

  if (adminExists) {
    return;
  }

  // Cria a senha encriptada
  const saltGenerated = await genSalt(10);
  const senha = await hash('admin', saltGenerated);
  
  // Cria o usuario admin
  await prisma.user.create({
    data: {
      login: 'admin',
      nome: 'Admin',
      senha: senha,
      id_academia: 'academiaAdministradora',
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
