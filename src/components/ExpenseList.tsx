import React from 'react';
import { ChevronRight, DollarSign, Clock, CheckCircle, Folder } from 'lucide-react';
import type { ExpenseWithPayments } from '../types';
import { FOLDER_COLORS } from '../types';

interface ExpenseListProps {
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

export default function ExpenseList({ searchResults }: ExpenseListProps) {
  const expenses = searchResults?.length ? searchResults : mockExpenses;

  return (
    <div className="bg-white rounded-lg shadow-md border-t-4 border-blue-600">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">
          {searchResults?.length ? 'Resultados de Búsqueda' : 'Expedientes Recientes'}
        </h2>
      </div>
      
      <div className="divide-y divide-gray-200">
        {expenses.map((expense) => {
          const StatusIcon = statusIcons[expense.status];
          const totalPaid = expense.payments.reduce((sum, payment) => sum + payment.amount, 0);
          const remaining = expense.totalAmount - totalPaid;
          const folderColor = FOLDER_COLORS.find(c => c.id === expense.folderColor);
          
          return (
            <div 
              key={expense.id}
              className="p-6 hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <Folder 
                      className="w-5 h-5"
                      style={{ color: folderColor?.value }}
                    />
                    <h3 className="text-lg font-medium text-gray-900">
                      {expense.description}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[expense.status]}`}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {statusLabels[expense.status]}
                    </span>
                  </div>
                  
                  <div className="mt-2 flex items-center text-sm text-gray-500 space-x-4">
                    <span>Creado: {new Date(expense.createdAt).toLocaleDateString('es-AR')}</span>
                    <span>Vence: {new Date(expense.dueDate).toLocaleDateString('es-AR')}</span>
                    <span>Expediente N°: {expense.id}</span>
                  </div>

                  {expense.payments.length > 0 && (
                    <div className="mt-2">
                      <h4 className="text-sm font-medium text-gray-700">Pagos:</h4>
                      <div className="mt-1 space-y-1">
                        {expense.payments.map((payment) => (
                          <div key={payment.id} className="text-sm text-gray-500">
                            {payment.type === 'cheque' && `Cheque N° ${payment.chequeNumber}`}
                            {payment.type === 'transferencia' && 'Transferencia'}
                            {payment.type === 'efectivo' && 'Efectivo'}
                            {' - '}${payment.amount.toLocaleString('es-AR')}
                            {' - '}{new Date(payment.date).toLocaleDateString('es-AR')}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="ml-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      Total: ${expense.totalAmount.toLocaleString('es-AR')}
                    </p>
                    {expense.status !== 'pendiente' && (
                      <p className="text-sm text-gray-500">
                        Restante: ${remaining.toLocaleString('es-AR')}
                      </p>
                    )}
                  </div>
                </div>

                <ChevronRight className="ml-4 h-5 w-5 text-gray-400" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}