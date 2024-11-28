import React, { useState, useEffect } from 'react';
import { PlusCircle, FileText, Search } from 'lucide-react';
import ColorSelect from './forms/ColorSelect';
import PaymentSection from './forms/PaymentSection';
import StatusSelect from './forms/StatusSelect';
import { useAuth } from '../contexts/AuthContext';
import { FOLDER_COLORS } from '../types';
import type { Payment } from '../types';

export default function ExpenseForm() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    numeroExpediente: '',
    fechaInicio: '',
    fechaResolucion: '',
    description: '',
    amount: '',
    folderColor: '',
    binderColor: '',
    status: '',
    type: 'GASTO'
  });
  const [paymentType, setPaymentType] = useState<'cheque' | 'transferencia' | 'efectivo'>('cheque');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchExpediente, setSearchExpediente] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Get the selected color's value for dynamic styling
  const selectedColor = FOLDER_COLORS.find(c => c.id === formData.folderColor)?.value || '#FFFFFF';

  // Calculate contrasting text color based on background
  const getContrastColor = (hexcolor: string) => {
    const r = parseInt(hexcolor.slice(1, 3), 16);
    const g = parseInt(hexcolor.slice(3, 5), 16);
    const b = parseInt(hexcolor.slice(5, 7), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? '#000000' : '#FFFFFF';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (!formData.numeroExpediente) {
        throw new Error('El número de expediente es requerido');
      }

      // Here we would make the API call to save/update the expediente
      console.log('Form submitted:', { formData, payments });
      
      // Reset form after successful submission
      if (!isEditing) {
        setFormData({
          numeroExpediente: '',
          fechaInicio: '',
          fechaResolucion: '',
          description: '',
          amount: '',
          folderColor: '',
          binderColor: '',
          status: '',
          type: 'GASTO'
        });
        setPayments([]);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al procesar el expediente');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = async () => {
    if (!searchExpediente) {
      setError('Ingrese un número de expediente para buscar');
      return;
    }

    try {
      // Here we would make the API call to fetch the expediente
      // For now, we'll just simulate finding an expediente
      setIsEditing(true);
      // You would populate the form with the found expediente data here
    } catch (error) {
      setError('Expediente no encontrado');
    }
  };

  const addPayment = () => {
    setPayments([
      ...payments,
      {
        id: crypto.randomUUID(),
        expedienteId: '',
        amount: 0,
        type: paymentType,
        date: '',
        creadoPor: user?.id || ''
      }
    ]);
  };

  const removePayment = (id: string) => {
    setPayments(payments.filter(payment => payment.id !== id));
  };

  const updatePayment = (id: string, field: keyof Payment, value: string | number) => {
    setPayments(payments.map(payment => 
      payment.id === id ? { ...payment, [field]: value } : payment
    ));
  };

  // Dynamic styles based on selected color
  const formStyle = {
    backgroundColor: selectedColor,
    color: getContrastColor(selectedColor),
    transition: 'background-color 0.3s ease'
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-t-4 border-blue-600" style={formStyle}>
        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-red-400">⚠️</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <FileText className="h-6 w-6 mr-2" style={{ color: getContrastColor(selectedColor) }} />
            <h2 className="text-2xl font-bold" style={{ color: getContrastColor(selectedColor) }}>
              {isEditing ? 'Modificar' : 'Nuevo'} Expediente
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={searchExpediente}
              onChange={(e) => setSearchExpediente(e.target.value)}
              placeholder="Buscar expediente..."
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handleSearch}
              className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="numeroExpediente" className="block text-sm font-medium" style={{ color: getContrastColor(selectedColor) }}>
                Número de Expediente
              </label>
              <input
                type="text"
                id="numeroExpediente"
                value={formData.numeroExpediente}
                onChange={(e) => handleInputChange('numeroExpediente', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="fechaInicio" className="block text-sm font-medium" style={{ color: getContrastColor(selectedColor) }}>
                Fecha de Inicio
              </label>
              <input
                type="date"
                id="fechaInicio"
                value={formData.fechaInicio}
                onChange={(e) => handleInputChange('fechaInicio', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="fechaResolucion" className="block text-sm font-medium" style={{ color: getContrastColor(selectedColor) }}>
                Fecha de Resolución
              </label>
              <input
                type="date"
                id="fechaResolucion"
                value={formData.fechaResolucion}
                onChange={(e) => handleInputChange('fechaResolucion', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium" style={{ color: getContrastColor(selectedColor) }}>
                Descripción
              </label>
              <input
                type="text"
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                placeholder="Ej: Mantenimiento de calles"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium" style={{ color: getContrastColor(selectedColor) }}>
                Monto Total
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="amount"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <StatusSelect
              value={formData.status}
              onChange={(value) => handleInputChange('status', value)}
              textColor={getContrastColor(selectedColor)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ColorSelect
              id="folderColor"
              label="Color de Expediente"
              value={formData.folderColor}
              onChange={(value) => handleInputChange('folderColor', value)}
              required
              textColor={getContrastColor(selectedColor)}
            />

            <ColorSelect
              id="binderColor"
              label="Color de Bibliorato (Opcional)"
              value={formData.binderColor}
              onChange={(value) => handleInputChange('binderColor', value)}
              textColor={getContrastColor(selectedColor)}
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium" style={{ color: getContrastColor(selectedColor) }}>
              Tipo de Expediente
            </label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="GASTO">Gasto</option>
              <option value="INGRESO">Ingreso</option>
            </select>
          </div>

          <div className="pt-4">
            <h3 className="text-lg font-semibold mb-3" style={{ color: getContrastColor(selectedColor) }}>
              Método de Pago
            </h3>
            
            <div>
              <label htmlFor="paymentType" className="block text-sm font-medium" style={{ color: getContrastColor(selectedColor) }}>
                Tipo de Pago
              </label>
              <select
                id="paymentType"
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value as 'cheque' | 'transferencia' | 'efectivo')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="cheque">Cheque</option>
                <option value="transferencia">Transferencia</option>
                <option value="efectivo">Efectivo</option>
              </select>
            </div>

            <PaymentSection
              paymentType={paymentType}
              payments={payments}
              onAddPayment={addPayment}
              onRemovePayment={removePayment}
              onUpdatePayment={updatePayment}
              textColor={getContrastColor(selectedColor)}
            />
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  numeroExpediente: '',
                  fechaInicio: '',
                  fechaResolucion: '',
                  description: '',
                  amount: '',
                  folderColor: '',
                  binderColor: '',
                  status: '',
                  type: 'GASTO'
                });
                setPayments([]);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              {isEditing ? 'Actualizar' : 'Crear'} Expediente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}