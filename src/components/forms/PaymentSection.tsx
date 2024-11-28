import React from 'react';
import { PlusCircle, X } from 'lucide-react';
import type { Payment } from '../../types';

interface PaymentSectionProps {
  paymentType: 'cheque' | 'transferencia' | 'efectivo';
  payments: Payment[];
  onAddPayment: () => void;
  onRemovePayment: (id: string) => void;
  onUpdatePayment: (id: string, field: keyof Payment, value: string | number) => void;
  textColor?: string;
}

export default function PaymentSection({
  paymentType,
  payments,
  onAddPayment,
  onRemovePayment,
  onUpdatePayment,
  textColor = '#000000'
}: PaymentSectionProps) {
  if (paymentType !== 'cheque') {
    return (
      <div className="mt-4">
        <div>
          <label htmlFor="paymentAmount" className="block text-sm font-medium" style={{ color: textColor }}>
            Monto del Pago
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              id="paymentAmount"
              className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              min="0"
              step="0.01"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-md font-medium" style={{ color: textColor }}>Cheques</h4>
        <button
          type="button"
          onClick={onAddPayment}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusCircle className="w-4 h-4 mr-1" />
          Agregar Cheque
        </button>
      </div>

      <div className="space-y-4">
        {payments.map((payment) => (
          <div key={payment.id} className="relative p-4 border border-gray-200 rounded-lg bg-gray-50">
            <button
              type="button"
              onClick={() => onRemovePayment(payment.id)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Número de Cheque
                </label>
                <input
                  type="text"
                  value={payment.chequeNumber || ''}
                  onChange={(e) => onUpdatePayment(payment.id, 'chequeNumber', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Monto
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    value={payment.amount}
                    onChange={(e) => onUpdatePayment(payment.id, 'amount', parseFloat(e.target.value))}
                    className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Fecha de Pago
                </label>
                <input
                  type="date"
                  value={payment.date}
                  onChange={(e) => onUpdatePayment(payment.id, 'date', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Notas
                </label>
                <input
                  type="text"
                  value={payment.notas || ''}
                  onChange={(e) => onUpdatePayment(payment.id, 'notas', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Notas adicionales..."
                />
              </div>
            </div>
          </div>
        ))}

        {payments.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No hay cheques agregados. Haga clic en "Agregar Cheque" para comenzar.
          </div>
        )}
      </div>
    </div>
  );
}