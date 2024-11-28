import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
});

export const expedienteSchema = z.object({
  numeroExpediente: z.string().min(1, 'El número de expediente es requerido'),
  tipo: z.enum(['INGRESO', 'GASTO']),
  color: z.string().min(1, 'El color es requerido'),
  colorBibliorato: z.string().optional(),
  descripcion: z.string().min(1, 'La descripción es requerida'),
  monto: z.number().positive('El monto debe ser positivo'),
  estado: z.enum(['PAGADO', 'ABIERTO', 'CERRADO', 'PENDIENTE', 'FALTAN_FIRMAS'])
});

export const pagoSchema = z.object({
  expedienteId: z.string().uuid(),
  monto: z.number().positive('El monto debe ser positivo'),
  tipo: z.enum(['CHEQUE', 'TRANSFERENCIA', 'EFECTIVO']),
  chequeNumero: z.string().optional(),
  fecha: z.date(),
  notas: z.string().optional()
});