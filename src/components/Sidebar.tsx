import React from 'react';
import { FileText, Search, Table2 } from 'lucide-react';
import clsx from 'clsx';

type View = 'new' | 'search' | 'table';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

interface NavItem {
  id: View;
  name: string;
  icon: React.ElementType;
}

const navigation: NavItem[] = [
  { id: 'new', name: 'Nuevo Expediente', icon: FileText },
  { id: 'search', name: 'Buscar', icon: Search },
  { id: 'table', name: 'Tabla de Expedientes', icon: Table2 },
];

export default function Sidebar({ currentView, onViewChange }: SidebarProps) {
  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white border-r border-gray-200">
          <div className="flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => onViewChange(item.id)}
                    className={clsx(
                      currentView === item.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                      'group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full'
                    )}
                  >
                    <Icon
                      className={clsx(
                        currentView === item.id
                          ? 'text-blue-600'
                          : 'text-gray-400 group-hover:text-gray-500',
                        'mr-3 h-5 w-5'
                      )}
                    />
                    {item.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}