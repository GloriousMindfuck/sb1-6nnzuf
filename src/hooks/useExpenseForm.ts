import { useState } from 'react';
import { expenseSchema, paymentSchema } from '../utils/validators';
import { createExpense } from '../services/expenseService';
import { useAuth } from '../contexts/AuthContext';
import type { Payment } from '../types';

export function useExpenseForm() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    folderColor: '',
    binderColor: '',
    status: '',
    type: 'GASTO'
  });
  const [paymentType, setPaymentType] = useState<'cheque' | 'transferencia' | 'efectivo'>('cheque');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const expenseData = {
        numeroExpediente: generateExpenseNumber(),
        tipo: formData.type as TipoMovimiento,
        color: formData.folderColor,
        colorBibliorato: formData.binderColor || undefined,
        descripcion: formData.description,
        monto: parseFloat(formData.amount),
        estado: formData.status as EstadoExpediente,
        creadoPor: user.id,
      };

      const validatedExpense = expenseSchema.parse(expenseData);
      const validatedPayments = payments.map(payment => 
        paymentSchema.parse({
          ...payment,
          creadoPor: user.id,
        })
      );

      await createExpense(validatedExpense, validatedPayments);
      
      // Reset form
      setFormData({
        description: '',
        amount: '',
        folderColor: '',
        binderColor: '',
        status: '',
        type: 'GASTO'
      });
      setPayments([]);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el expediente');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  return {
    formData,
    paymentType,
    payments,
    isSubmitting,
    error,
    handleSubmit,
    handleInputChange,
    setPaymentType,
    addPayment,
    removePayment,
    updatePayment,
  };
}