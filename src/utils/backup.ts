import { saveAs } from 'file-saver';
import { prisma } from '../lib/db';
import { formatDate } from './formatters';

export async function createBackup() {
  try {
    const [expedientes, pagos, usuarios, logs] = await Promise.all([
      prisma.expediente.findMany(),
      prisma.pago.findMany(),
      prisma.usuario.findMany({
        select: {
          id: true,
          nombre: true,
          email: true,
          rol: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      prisma.log.findMany()
    ]);

    const backup = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      data: {
        expedientes,
        pagos,
        usuarios,
        logs
      }
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const fileName = `backup-${formatDate(new Date()).replace(/\//g, '-')}.json`;
    saveAs(blob, fileName);

    // Register backup in database
    await prisma.backup.create({
      data: {
        nombre: fileName,
        descripcion: `Backup automático - ${expedientes.length} expedientes`,
        archivo: fileName,
        creadoPor: 'SYSTEM'
      }
    });

    return { success: true, fileName };
  } catch (error) {
    console.error('Error creating backup:', error);
    throw new Error('Error al crear la copia de seguridad');
  }
}

export async function restoreBackup(file: File) {
  try {
    const content = await file.text();
    const backup = JSON.parse(content);

    // Validate backup format
    if (!backup.version || !backup.timestamp || !backup.data) {
      throw new Error('Formato de backup inválido');
    }

    // Start a transaction
    await prisma.$transaction(async (tx) => {
      // Clear existing data
      await tx.log.deleteMany();
      await tx.pago.deleteMany();
      await tx.expediente.deleteMany();
      await tx.usuario.deleteMany();

      // Restore data
      if (backup.data.usuarios?.length) {
        await tx.usuario.createMany({
          data: backup.data.usuarios
        });
      }

      if (backup.data.expedientes?.length) {
        await tx.expediente.createMany({
          data: backup.data.expedientes
        });
      }

      if (backup.data.pagos?.length) {
        await tx.pago.createMany({
          data: backup.data.pagos
        });
      }

      if (backup.data.logs?.length) {
        await tx.log.createMany({
          data: backup.data.logs
        });
      }
    });

    return { success: true, message: 'Restauración completada con éxito' };
  } catch (error) {
    console.error('Error restoring backup:', error);
    throw new Error('Error al restaurar la copia de seguridad');
  }
}