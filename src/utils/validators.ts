import { z } from 'zod';
import { TipoMovimiento, EstadoExpediente, TipoPago } from '@prisma/client';

export const expenseSchema = z.object({
  numeroExpediente: z.string().min(1, 'El número de expediente es requerido'),
  tipo: z.nativeEnum(TipoMovimiento),
  color: z.string().min(1, 'El color es requerido'),
  colorBibliorato: z.string().optional(),
  descripcion: z.string().min(1, 'La descripción es requerida'),
  monto: z.number().positive('El monto debe ser positivo'),
  estado: z.nativeEnum(EstadoExpediente),
  creadoPor: z.string().uuid('ID de usuario inválido'),
});

export const paymentSchema = z.object({
  expedienteId: z.string().uuid(),
  monto: z.number().positive('El monto debe ser positivo'),
  tipo: z.nativeEnum(TipoPago),
  chequeNumero: z.string().optional(),
  fecha: z.date(),
  notas: z.string().optional(),
  creadoPor: z.string().uuid('ID de usuario inválido'),
});

export const searchParamsSchema = z.object({
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  description: z.string().optional(),
  amountFrom: z.number().positive().optional(),
  amountTo: z.number().positive().optional(),
});