'use client';

import { useEffect, useRef } from 'react';

/**
 * Editor de texto enriquecido sencillo (negrita, cursiva, tamaño de letra).
 * Guarda el contenido como HTML simple. Pensado para descripciones cortas,
 * no es un editor de documentos completo.
 */
export default function RichTextEditor({ value, onChange, placeholder }) {
  const ref = useRef(null);
  const isFirstRender = useRef(true);

  // Solo volcamos el HTML inicial una vez (o cuando cambia por fuera, ej. al
  // cargar los datos de edición); si lo hiciéramos en cada render, se
  // perdería la posición del cursor mientras el admin escribe.
  useEffect(() => {
    if (ref.current && (isFirstRender.current || document.activeElement !== ref.current)) {
      ref.current.innerHTML = value || '';
      isFirstRender.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const exec = (command, arg) => {
    ref.current?.focus();
    document.execCommand(command, false, arg);
    onChange(ref.current?.innerHTML || '');
  };

  const handleInput = () => {
    onChange(ref.current?.innerHTML || '');
  };

  return (
    <div className="rounded-2xl border border-brand-dark/15 focus-within:ring-2 focus-within:ring-brand-cream focus-within:border-brand-dark/30 transition overflow-hidden">
      <div className="flex flex-wrap items-center gap-1 border-b border-brand-dark/10 bg-brand-cream/20 px-2 py-1.5">
        <button
          type="button"
          onClick={() => exec('bold')}
          className="w-8 h-8 rounded-lg font-bold hover:bg-brand-cream/60 transition"
          title="Negrita"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => exec('italic')}
          className="w-8 h-8 rounded-lg italic hover:bg-brand-cream/60 transition"
          title="Cursiva"
        >
          I
        </button>
        <span className="w-px h-5 bg-brand-dark/15 mx-1" />
        <button
          type="button"
          onClick={() => exec('fontSize', '2')}
          className="px-2 h-8 rounded-lg text-xs hover:bg-brand-cream/60 transition"
          title="Letra pequeña"
        >
          A⁻
        </button>
        <button
          type="button"
          onClick={() => exec('fontSize', '3')}
          className="px-2 h-8 rounded-lg text-sm hover:bg-brand-cream/60 transition"
          title="Letra normal"
        >
          A
        </button>
        <button
          type="button"
          onClick={() => exec('fontSize', '5')}
          className="px-2 h-8 rounded-lg text-base hover:bg-brand-cream/60 transition"
          title="Letra grande"
        >
          A⁺
        </button>
        <button
          type="button"
          onClick={() => exec('fontSize', '7')}
          className="px-2 h-8 rounded-lg text-lg hover:bg-brand-cream/60 transition"
          title="Letra muy grande"
        >
          A⁺⁺
        </button>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        data-placeholder={placeholder}
        className="rich-text-editable min-h-[140px] px-4 py-3 focus:outline-none text-brand-dark"
      />
    </div>
  );
}
