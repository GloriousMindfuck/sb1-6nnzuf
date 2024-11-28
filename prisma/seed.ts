import { PrismaClient, Rol } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await hash('Municipalidad2025', 10);
  
  await prisma.usuario.upsert({
    where: { email: 'admin@guardiamitre.gob.ar' },
    update: {},
    create: {
      email: 'admin@guardiamitre.gob.ar',
      nombre: 'Administrador',
      passwordHash: adminPassword,
      rol: Rol.ADMIN
    }
  });

  console.log('Database has been seeded. 🌱');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });