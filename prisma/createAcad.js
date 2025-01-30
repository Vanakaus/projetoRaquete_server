const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const { genSalt } = require('bcryptjs');
const { hash } = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {

  // Verifica se o usuario admin ja foi criado, caso sim, não faz nada
  const acadExists = await prisma.academias.findUnique({
    where: {
      id: 'academiaAdministradora',
    },
  });

  if (acadExists) {
    return;
  }

  // Cria o usuario admin
  await prisma.academias.create({
    data: {
      id: 'academiaAdministradora',
      id_admin: 'admin',
      nome: 'Academia Administradora',
      telefone: '1234567890',
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
