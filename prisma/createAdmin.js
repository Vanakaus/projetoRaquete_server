const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const prisma = new PrismaClient();

async function main() {

  // Cria o usuario admin
  await prisma.user.create({
    data: {
      cpf: '12345678900',
      username: 'adm',
      email: 'admin@admin',
      senha: 'adminadmin',
      nome: 'Administrador',
      sobrenome: 'admin',
      dataNascimento: faker.date.past(30, new Date(2000, 0, 1)),
      telefone: '123456789',
      celular: '123456789',
      rank: 0,
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
