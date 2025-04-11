const { CreateAdmin } = require('./createAdmin');
const { CreateStatus } = require('./createStatus');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  
  // Cria os valores padroes do banco
  CreateStatus();
  CreateAdmin();
 
  // // Cria o usuario admin executando o script createAdmin.js
  // exec('node prisma/createAdmin.js', (err, stdout, stderr) => {
  //   if (err) {
  //     console.error('Error creating admin user');
  //     console.error(err);
  //     return;
  //   }
  // });

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
