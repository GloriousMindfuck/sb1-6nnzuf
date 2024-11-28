import React, { useState, useRef } from 'react';
import { Database, Upload, AlertCircle } from 'lucide-react';
import { createBackup, restoreBackup } from '../utils/backup';

export default function BackupRestore() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBackup = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await createBackup();
      setSuccess(`Backup creado exitosamente: ${result.fileName}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el backup');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await restoreBackup(file);
      setSuccess(result.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al restaurar el backup');
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-600">
      <div className="flex items-center mb-6">
        <Database className="h-6 w-6 text-blue-600 mr-2" />
        <h2 className="text-xl font-bold text-gray-800">Copias de Seguridad</h2>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-green-400">✓</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <button
            onClick={handleBackup}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <Database className="w-4 h-4 mr-2" />
            {isLoading ? 'Creando backup...' : 'Crear Backup'}
          </button>
        </div>

        <div className="border-t pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Restaurar desde archivo
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleRestore}
              accept=".json"
              disabled={isLoading}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <Upload className="w-5 h-5 text-gray-400" />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Seleccione un archivo de backup (.json) para restaurar
          </p>
        </div>
      </div>
    </div>
  );
}