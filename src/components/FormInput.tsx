import React from 'react';

import type { UseFormRegisterReturn } from 'react-hook-form';

interface Props {
  label: string;
  id: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  // optional register return when used with react-hook-form
  register?: UseFormRegisterReturn;
  placeholder?: string;
}

const FormInput: React.FC<Props> = ({ label, id, type = 'text', value, onChange, error, register, placeholder }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        id={id}
        {...(register ?? {})}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full p-3 border rounded-md focus:ring-2 transition-colors ${error
          ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
          : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
          }`}
      />
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default FormInput;

