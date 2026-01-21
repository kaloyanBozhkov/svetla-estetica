'use client';

import { useState, useEffect, type InputHTMLAttributes } from 'react';
import { Input } from '@/components/atoms';
import { ActionButton } from '@/components/atoms/ActionButton';

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onSearch: (value: string) => void;
  initialValue?: string;
  debounceMs?: number;
}

export function SearchInput({
  onSearch,
  initialValue = '',
  debounceMs = 400,
  placeholder = 'Cerca...',
  className,
  ...inputProps
}: SearchInputProps) {
  const [value, setValue] = useState(initialValue);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(value);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [value, debounceMs, onSearch]);

  const handleClear = () => {
    setValue('');
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Input
        {...inputProps}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="flex-1"
      />
      {value && (
        <ActionButton variant="ghost" size="sm" onClick={handleClear} type="button">
          Cancella
        </ActionButton>
      )}
    </div>
  );
}
