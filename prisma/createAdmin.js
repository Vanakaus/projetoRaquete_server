const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const { genSalt } = require('bcryptjs');
const { hash } = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {

  // Verifica se o usuario admin ja foi criado, caso sim, não faz nada
  const adminExists = await prisma.user.findUnique({
    where: {
      cpf: '12345678900',
    },
  });

  if (adminExists) {
    return;
  }

  // Cria a senha encriptada
  const saltGenerated = await genSalt(10);
  const senha = await hash('adminadmin', saltGenerated);
  
  // Cria o usuario admin
  await prisma.user.create({
    data: {
      cpf: '12345678900',
      username: 'adm',
      email: 'admin@admin',
      senha: senha,
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
