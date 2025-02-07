import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function CreateAdmin() {

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



CreateAdmin()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
