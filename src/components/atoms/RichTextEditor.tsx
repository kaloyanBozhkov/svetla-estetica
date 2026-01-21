'use client';

import { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({
  label,
  value,
  onChange,
  placeholder,
  className,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isInternalChange = useRef(false);

  // Sync external value changes to the editor
  useEffect(() => {
    if (editorRef.current && !isInternalChange.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value;
      }
    }
    isInternalChange.current = false;
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      isInternalChange.current = true;
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const insertLineBreak = () => {
    document.execCommand('insertHTML', false, '<br/><br/>');
    editorRef.current?.focus();
    handleInput();
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}

      <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-b border-gray-200">
          <button
            type="button"
            onClick={() => execCommand('bold')}
            className="p-1.5 rounded hover:bg-gray-200 text-gray-700 font-bold text-sm min-w-[28px]"
            title="Grassetto (Ctrl+B)"
          >
            B
          </button>
          <button
            type="button"
            onClick={() => execCommand('italic')}
            className="p-1.5 rounded hover:bg-gray-200 text-gray-700 italic text-sm min-w-[28px]"
            title="Corsivo (Ctrl+I)"
          >
            I
          </button>
          <button
            type="button"
            onClick={() => execCommand('underline')}
            className="p-1.5 rounded hover:bg-gray-200 text-gray-700 underline text-sm min-w-[28px]"
            title="Sottolineato (Ctrl+U)"
          >
            U
          </button>
          <div className="w-px h-5 bg-gray-300 mx-1" />
          <button
            type="button"
            onClick={insertLineBreak}
            className="px-2 py-1 rounded hover:bg-gray-200 text-gray-700 text-xs"
            title="A capo"
          >
            ↵ A capo
          </button>
          <button
            type="button"
            onClick={() => execCommand('insertUnorderedList')}
            className="px-2 py-1 rounded hover:bg-gray-200 text-gray-700 text-xs"
            title="Lista puntata"
          >
            • Lista
          </button>
        </div>

        {/* Contenteditable Editor */}
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          data-placeholder={placeholder}
          className={cn(
            'w-full px-4 py-3 text-gray-900 focus:outline-none min-h-[150px] max-h-[400px] overflow-y-auto',
            '[&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-gray-400',
            '[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_li]:my-1'
          )}
        />
      </div>
    </div>
  );
}
