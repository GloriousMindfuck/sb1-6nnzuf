import React, { useState } from 'react';
import { Search, FileSearch } from 'lucide-react';
import type { ExpenseWithPayments } from '../types';

interface SearchFormProps {
  onSearch: (results: ExpenseWithPayments[]) => void;
}

export default function SearchForm({ onSearch }: SearchFormProps) {
  const [searchType, setSearchType] = useState<'date' | 'description' | 'amount'>('description');
  const [searchValue, setSearchValue] = useState('');
  const [dateRange, setDateRange] = useState({
    from: '',
    to: ''
  });
  const [amountRange, setAmountRange] = useState({
    min: '',
    max: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Here we would make the actual API call with the search parameters
      const searchParams: Record<string, any> = {};
      
      if (searchType === 'date' && dateRange.from && dateRange.to) {
        searchParams.dateFrom = dateRange.from;
        searchParams.dateTo = dateRange.to;
      } else if (searchType === 'amount' && (amountRange.min || amountRange.max)) {
        if (amountRange.min) searchParams.amountFrom = parseFloat(amountRange.min);
        if (amountRange.max) searchParams.amountTo = parseFloat(amountRange.max);
      } else if (searchType === 'description' && searchValue) {
        searchParams.description = searchValue;
      }

      // For now, we'll just pass empty results
      onSearch([]);
      
    } catch (error) {
      console.error('Error searching expenses:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-600">
      <div className="flex items-center mb-6">
        <FileSearch className="h-6 w-6 text-blue-600 mr-2" />
        <h2 className="text-xl font-bold text-gray-800">Búsqueda de Expedientes</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="searchType" className="block text-sm font-medium text-gray-700">
            Buscar por
          </label>
          <select
            id="searchType"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value as any)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="description">Descripción</option>
            <option value="date">Rango de Fechas</option>
            <option value="amount">Rango de Montos</option>
          </select>
        </div>

        {searchType === 'date' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700">
                Fecha Desde
              </label>
              <input
                type="date"
                id="dateFrom"
                value={dateRange.from}
                onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="dateTo" className="block text-sm font-medium text-gray-700">
                Fecha Hasta
              </label>
              <input
                type="date"
                id="dateTo"
                value={dateRange.to}
                onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        ) : searchType === 'amount' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="amountMin" className="block text-sm font-medium text-gray-700">
                Monto Mínimo
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="amountMin"
                  value={amountRange.min}
                  onChange={(e) => setAmountRange(prev => ({ ...prev, min: e.target.value }))}
                  className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <div>
              <label htmlFor="amountMax" className="block text-sm font-medium text-gray-700">
                Monto Máximo
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="amountMax"
                  value={amountRange.max}
                  onChange={(e) => setAmountRange(prev => ({ ...prev, max: e.target.value }))}
                  className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>
        ) : (
          <div>
            <label htmlFor="searchValue" className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <input
              type="text"
              id="searchValue"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Buscar en descripción..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => {
              setSearchType('description');
              setSearchValue('');
              setDateRange({ from: '', to: '' });
              setAmountRange({ min: '', max: '' });
            }}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Limpiar
          </button>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Search className="w-4 h-4 mr-2" />
            Buscar
          </button>
        </div>
      </form>
    </div>
  );
}