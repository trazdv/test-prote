'use client';

import { useEffect, useRef } from 'react';

/**
 * Editor de texto enriquecido sencillo (negrita, cursiva, tamaño de letra).
 * No usa document.execCommand (los navegadores lo están retirando poco a
 * poco y ya no aplica bien los estilos); en su lugar, envuelve manualmente
 * el texto seleccionado con las etiquetas correspondientes.
 *
 * Cómo se usa: selecciona un trozo de texto y pulsa el botón del estilo
 * que quieras aplicar. Si no hay nada seleccionado, el botón no hace nada
 * (es la limitación de esta versión sencilla del editor).
 */
export default function RichTextEditor({ value, onChange, placeholder }) {
  const ref = useRef(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (ref.current && (isFirstRender.current || document.activeElement !== ref.current)) {
      ref.current.innerHTML = value || '';
      isFirstRender.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const wrapSelection = (tagName, style) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);

    // Ignoramos si no hay texto seleccionado, o si la selección está fuera
    // de este editor (por ejemplo, si el usuario tenía seleccionado texto
    // de otra parte de la página).
    if (range.collapsed || !ref.current || !ref.current.contains(range.commonAncestorContainer)) {
      return;
    }

    const wrapper = document.createElement(tagName);
    if (style) wrapper.setAttribute('style', style);

    try {
      range.surroundContents(wrapper);
    } catch (e) {
      // La selección abarca varios elementos (ej. dos párrafos): extraemos
      // el contenido y lo volvemos a insertar ya envuelto.
      const contents = range.extractContents();
      wrapper.appendChild(contents);
      range.insertNode(wrapper);
    }

    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.selectNodeContents(wrapper);
    selection.addRange(newRange);

    onChange(ref.current.innerHTML);
  };

  const handleInput = () => {
    onChange(ref.current?.innerHTML || '');
  };

  // Evita que el botón le quite el foco (y por tanto la selección de texto)
  // al editor antes de que se aplique el estilo.
  const preventBlur = (e) => e.preventDefault();

  return (
    <div className="rounded-2xl border border-brand-dark/15 focus-within:ring-2 focus-within:ring-brand-cream focus-within:border-brand-dark/30 transition overflow-hidden">
      <div className="flex flex-wrap items-center gap-1 border-b border-brand-dark/10 bg-brand-cream/20 px-2 py-1.5">
        <button
          type="button"
          onMouseDown={preventBlur}
          onClick={() => wrapSelection('strong')}
          className="w-8 h-8 rounded-lg font-bold hover:bg-brand-cream/60 transition"
          title="Negrita (selecciona texto primero)"
        >
          B
        </button>
        <button
          type="button"
          onMouseDown={preventBlur}
          onClick={() => wrapSelection('em')}
          className="w-8 h-8 rounded-lg italic hover:bg-brand-cream/60 transition"
          title="Cursiva (selecciona texto primero)"
        >
          I
        </button>
        <span className="w-px h-5 bg-brand-dark/15 mx-1" />
        <button
          type="button"
          onMouseDown={preventBlur}
          onClick={() => wrapSelection('span', 'font-size:0.85em')}
          className="px-2 h-8 rounded-lg text-xs hover:bg-brand-cream/60 transition"
          title="Letra pequeña (selecciona texto primero)"
        >
          A⁻
        </button>
        <button
          type="button"
          onMouseDown={preventBlur}
          onClick={() => wrapSelection('span', 'font-size:1em')}
          className="px-2 h-8 rounded-lg text-sm hover:bg-brand-cream/60 transition"
          title="Letra normal (selecciona texto primero)"
        >
          A
        </button>
        <button
          type="button"
          onMouseDown={preventBlur}
          onClick={() => wrapSelection('span', 'font-size:1.35em')}
          className="px-2 h-8 rounded-lg text-base hover:bg-brand-cream/60 transition"
          title="Letra grande (selecciona texto primero)"
        >
          A⁺
        </button>
        <button
          type="button"
          onMouseDown={preventBlur}
          onClick={() => wrapSelection('span', 'font-size:1.75em')}
          className="px-2 h-8 rounded-lg text-lg hover:bg-brand-cream/60 transition"
          title="Letra muy grande (selecciona texto primero)"
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
