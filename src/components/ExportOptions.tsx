import React, { useState } from 'react';
import { Download, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import { formatDate } from '../utils/formatters';
import type { ExpenseWithPayments } from '../types';

interface ExportOptionsProps {
  data: ExpenseWithPayments[];
  onExport: () => void;
}

export default function ExportOptions({ data, onExport }: ExportOptionsProps) {
  const [exportType, setExportType] = useState<'all' | 'filtered'>('filtered');
  const [dateRange, setDateRange] = useState({
    from: '',
    to: ''
  });

  const handleExport = () => {
    const dataToExport = data.map(expense => ({
      'Número Expediente': expense.numeroExpediente,
      'Fecha Ingreso': formatDate(expense.fechaIngreso),
      'Tipo': expense.tipo === 'INGRESO' ? 'Ingreso' : 'Gasto',
      'Descripción': expense.descripcion,
      'Monto': expense.monto,
      'Estado': expense.estado,
      'Color': expense.color,
      'Pagos Realizados': expense.payments.length,
      'Monto Total Pagado': expense.payments.reduce((sum, p) => sum + p.amount, 0)
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Expedientes');

    const fileName = `expedientes-${formatDate(new Date()).replace(/\//g, '-')}.xlsx`;
    XLSX.writeFile(wb, fileName);

    onExport();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-600">
      <div className="flex items-center mb-6">
        <FileSpreadsheet className="h-6 w-6 text-blue-600 mr-2" />
        <h2 className="text-xl font-bold text-gray-800">Exportar Datos</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tipo de Exportación
          </label>
          <select
            value={exportType}
            onChange={(e) => setExportType(e.target.value as 'all' | 'filtered')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="filtered">Datos Filtrados</option>
            <option value="all">Todos los Datos</option>
          </select>
        </div>

        {exportType === 'all' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fecha Desde
              </label>
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fecha Hasta
              </label>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleExport}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar a Excel
          </button>
        </div>
      </div>
    </div>
  );
}