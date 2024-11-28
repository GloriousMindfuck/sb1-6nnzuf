import { Rol, TipoMovimiento, EstadoExpediente, TipoPago } from '@prisma/client';

export interface User {
  id: string;
  nombre: string;
  email: string;
  rol: Rol;
}

export interface Expense {
  id: string;
  numeroExpediente: string;
  fechaIngreso: string;
  tipo: TipoMovimiento;
  color: string;
  colorBibliorato?: string;
  descripcion: string;
  monto: number;
  estado: EstadoExpediente;
  creadoPor: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  expedienteId: string;
  monto: number;
  tipo: TipoPago;
  chequeNumero?: string;
  fecha: string;
  notas?: string;
  creadoPor: string;
}

export interface ExpenseWithPayments extends Expense {
  payments: Payment[];
}

export interface Log {
  id: string;
  usuarioId: string;
  expedienteId?: string;
  accion: string;
  detalles?: string;
  createdAt: string;
}

export interface Backup {
  id: string;
  nombre: string;
  descripcion?: string;
  archivo: string;
  createdAt: string;
  creadoPor: string;
}

export const FOLDER_COLORS = [
  { id: 'white', name: 'Blanco', value: '#FFFFFF' },
  { id: 'black', name: 'Negro', value: '#000000' },
  { id: 'pastel-blue', name: 'Azul Pastel', value: '#A8D8EA' },
  { id: 'pastel-green', name: 'Verde Pastel', value: '#C8E6C9' },
  { id: 'pastel-pink', name: 'Rosa Pastel', value: '#F8BBD0' },
  { id: 'pastel-purple', name: 'Púrpura Pastel', value: '#E1BEE7' },
  { id: 'pastel-yellow', name: 'Amarillo Pastel', value: '#FFF9C4' },
  { id: 'pastel-orange', name: 'Naranja Pastel', value: '#FFE0B2' },
  { id: 'pastel-red', name: 'Rojo Pastel', value: '#FFCDD2' },
  { id: 'pastel-brown', name: 'Marrón Pastel', value: '#D7CCC8' },
  { id: 'pastel-teal', name: 'Verde Azulado Pastel', value: '#B2DFDB' },
  { id: 'pastel-lime', name: 'Lima Pastel', value: '#F0F4C3' }
] as const;

export const EXPENSE_STATES = [
  { id: 'PAGADO', name: 'Pagado' },
  { id: 'ABIERTO', name: 'Abierto' },
  { id: 'CERRADO', name: 'Cerrado' },
  { id: 'PENDIENTE', name: 'Pendiente' },
  { id: 'FALTAN_FIRMAS', name: 'Faltan Firmas' }
] as const;