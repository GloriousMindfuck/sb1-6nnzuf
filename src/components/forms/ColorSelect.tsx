import React from 'react';
import { FOLDER_COLORS } from '../../types';

interface ColorSelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  textColor?: string;
}

export default function ColorSelect({ id, label, value, onChange, required = false, textColor = '#000000' }: ColorSelectProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium" style={{ color: textColor }}>
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        required={required}
      >
        <option value="">Seleccionar color...</option>
        {FOLDER_COLORS.map((color) => (
          <option key={color.id} value={color.id}>
            {color.name}
          </option>
        ))}
      </select>
    </div>
  );
}