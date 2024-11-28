import React from 'react';
import { EXPENSE_STATES } from '../../types';

interface StatusSelectProps {
  value: string;
  onChange: (value: string) => void;
  textColor?: string;
}

export default function StatusSelect({ value, onChange, textColor = '#000000' }: StatusSelectProps) {
  return (
    <div>
      <label htmlFor="status" className="block text-sm font-medium" style={{ color: textColor }}>
        Estado
      </label>
      <select
        id="status"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        required
      >
        <option value="">Seleccionar estado...</option>
        {EXPENSE_STATES.map((state) => (
          <option key={state.id} value={state.id}>
            {state.name}
          </option>
        ))}
      </select>
    </div>
  );
}