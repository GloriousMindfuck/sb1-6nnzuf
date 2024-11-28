import { prisma } from '../lib/db';
import type { Expense, Payment } from '../types';

export async function createExpense(data: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>, payments: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>[]) {
  return prisma.$transaction(async (tx) => {
    const expense = await tx.expediente.create({
      data: {
        numeroExpediente: data.numeroExpediente,
        fechaIngreso: new Date(),
        tipo: data.tipo,
        color: data.color,
        colorBibliorato: data.colorBibliorato,
        descripcion: data.descripcion,
        monto: data.monto,
        estado: data.estado,
        creadoPor: data.creadoPor,
      },
    });

    if (payments.length > 0) {
      await tx.pago.createMany({
        data: payments.map(payment => ({
          ...payment,
          expedienteId: expense.id,
        })),
      });
    }

    return expense;
  });
}

export async function getExpenseById(id: string) {
  return prisma.expediente.findUnique({
    where: { id },
    include: {
      pagos: true,
    },
  });
}

export async function searchExpenses(params: {
  dateFrom?: Date;
  dateTo?: Date;
  description?: string;
  amountFrom?: number;
  amountTo?: number;
}) {
  const { dateFrom, dateTo, description, amountFrom, amountTo } = params;

  return prisma.expediente.findMany({
    where: {
      AND: [
        description ? {
          descripcion: {
            contains: description,
            mode: 'insensitive',
          },
        } : {},
        dateFrom ? {
          fechaIngreso: {
            gte: dateFrom,
          },
        } : {},
        dateTo ? {
          fechaIngreso: {
            lte: dateTo,
          },
        } : {},
        amountFrom ? {
          monto: {
            gte: amountFrom,
          },
        } : {},
        amountTo ? {
          monto: {
            lte: amountTo,
          },
        } : {},
      ],
    },
    include: {
      pagos: true,
    },
    orderBy: {
      fechaIngreso: 'desc',
    },
  });
}