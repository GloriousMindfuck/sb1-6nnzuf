import React from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Clock, DollarSign, CheckCircle } from 'lucide-react';
import type { ExpenseWithPayments } from '../types';

interface ExpenseTableProps {
  searchResults?: ExpenseWithPayments[];
}

const mockExpenses: ExpenseWithPayments[] = [
  {
    id: '1',
    description: 'Equipamiento para Mantenimiento Vial',
    totalAmount: 25000,
    status: 'parcial',
    createdAt: '2024-03-10',
    dueDate: '2024-04-10',
    folderColor: 'pastel-blue',
    binderColor: 'pastel-green',
    payments: [
      {
        id: 'p1',
        expenseId: '1',
        amount: 15000,
        type: 'cheque',
        chequeNumber: '12345',
        date: '2024-03-10',
      }
    ]
  },
  {
    id: '2',
    description: 'Renovación de Plaza Municipal',
    totalAmount: 50000,
    status: 'pendiente',
    createdAt: '2024-03-08',
    dueDate: '2024-04-08',
    folderColor: 'pastel-yellow',
    payments: []
  }
];

const statusColors = {
  pendiente: 'bg-yellow-100 text-yellow-800',
  parcial: 'bg-blue-100 text-blue-800',
  completado: 'bg-green-100 text-green-800'
};

const statusIcons = {
  pendiente: Clock,
  parcial: DollarSign,
  completado: CheckCircle
};

const statusLabels = {
  pendiente: 'Pendiente',
  parcial: 'Pago Parcial',
  completado: 'Completado'
};

const columnHelper = createColumnHelper<ExpenseWithPayments>();

const columns = [
  columnHelper.accessor('id', {
    header: 'N° Expediente',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('description', {
    header: 'Descripción',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('totalAmount', {
    header: 'Monto Total',
    cell: info => `$${info.getValue().toLocaleString('es-AR')}`,
  }),
  columnHelper.accessor('status', {
    header: 'Estado',
    cell: info => {
      const status = info.getValue();
      const StatusIcon = statusIcons[status];
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status]}`}>
          <StatusIcon className="w-3 h-3 mr-1" />
          {statusLabels[status]}
        </span>
      );
    },
  }),
  columnHelper.accessor('createdAt', {
    header: 'Fecha de Ingreso',
    cell: info => new Date(info.getValue()).toLocaleDateString('es-AR'),
  }),
  columnHelper.accessor('dueDate', {
    header: 'Fecha de Vencimiento',
    cell: info => new Date(info.getValue()).toLocaleDateString('es-AR'),
  }),
];

export default function ExpenseTable({ searchResults }: ExpenseTableProps) {
  const data = searchResults?.length ? searchResults : mockExpenses;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-blue-600">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">
          {searchResults?.length ? 'Resultados de Búsqueda' : 'Expedientes'}
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map(row => (
              <tr
                key={row.id}
                className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
              >
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}