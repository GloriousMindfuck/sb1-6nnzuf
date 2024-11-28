import React, { useState } from 'react';
import { Building2 } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import LoginForm from './components/LoginForm';
import Sidebar from './components/Sidebar';
import ExpenseForm from './components/ExpenseForm';
import SearchForm from './components/SearchForm';
import ExpenseTable from './components/ExpenseTable';
import type { ExpenseWithPayments } from './types';

type View = 'new' | 'search' | 'table';

function App() {
  const { user, isLoading, setUser } = useAuth();
  const [currentView, setCurrentView] = useState<View>('table');
  const [searchResults, setSearchResults] = useState<ExpenseWithPayments[]>([]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      
      <div className="flex-1">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Building2 className="h-8 w-8 text-blue-600" />
                  <span className="ml-2 text-xl font-bold text-gray-900">
                    Municipalidad de Guardia Mitre
                  </span>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-gray-700 mr-4">{user.nombre}</span>
                <button
                  onClick={() => {
                    localStorage.removeItem('token');
                    setUser(null);
                  }}
                  className="text-sm text-gray-700 hover:text-gray-900"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {currentView === 'new' && user.rol === 'ADMIN' && <ExpenseForm />}
          {currentView === 'search' && <SearchForm onSearch={setSearchResults} />}
          {currentView === 'table' && <ExpenseTable searchResults={searchResults} />}
          {currentView === 'new' && user.rol !== 'ADMIN' && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-yellow-400">⚠️</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    No tienes permisos para crear nuevos expedientes.
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;