const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const prisma = new PrismaClient();

async function main() {

  // // Cria o usuario admin
  // await prisma.user.create({
  //   data: {
  //     cpf: '12345678900',
  //     username: 'vnks',
  //     email: 'vini@admin',
  //     senha: ,
  //     nome: 'vini',
  //     sobrenome: 'admin',
  //     dataNascimento: faker.date.past(30, new Date(2000, 0, 1)),
  //     telefone: '123456789',
  //     celular: '123456789',
  //     rank: 1000,
  //   },
  // });



  // // Cria 64 usuários
  // for (let i = 0; i < 64; i++) {
  //   await prisma.user.create({
  //     data: {
  //       cpf: faker.string.uuid(),
  //       username: faker.internet.userName(),
  //       email: faker.internet.email(),
  //       senha: faker.internet.password(),
  //       nome: faker.person.firstName(),
  //       sobrenome: faker.person.lastName(),
  //       dataNascimento: faker.date.past({30, new Date(2000, 0, 1)}),
  //       telefone: faker.phone.number().int(),
  //       celular: faker.phone.number().int(),
  //       rank: faker.datatype.number({ min: 100, max: 1000 }),
  //     },
  //   });
  // }

  // // Cria 6 campeonatos
  // const numInscriptions = [2, 4, 8, 16, 30, 54];
  // for (let i = 0; i < 6; i++) {
  //   const campeonato = await prisma.campeonatos.create({
  //     data: {
  //       id_criador: (await prisma.user.findFirst()).cpf,
  //       nome: `Campeonato ${i + 1}`,
  //       descricao: faker.lorem.sentence(),
  //       regras: faker.lorem.paragraph(),
  //       numJogadores: numInscriptions[i],
  //       dataInicio: faker.date.future(),
  //       dataFim: faker.date.future(),
  //       dataInscricao: faker.date.future(),
  //     },
  //   });



    // Cria inscrições para cada campeonato
  //   for (let j = 0; j < numInscriptions[i]; j++) {
  //     const user = await prisma.user.findFirst({
  //       skip: j,
  //     });

  //     await prisma.inscricao.create({
  //       data: {
  //         id_campeonato: campeonato.id,
  //         id_jogador: user.cpf,
  //       },
  //     });
  //   }
  // }
}



main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
