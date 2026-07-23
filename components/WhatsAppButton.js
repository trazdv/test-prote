'use client';

import { siteConfig } from '@/lib/siteConfig';

export default function WhatsAppButton() {
  return (
    <a
      href={siteConfig.contacto.whatsapp}
      target="_blank"
      rel="noreferrer"
      aria-label="Háblanos por WhatsApp"
      className="fixed z-40 flex items-center justify-center rounded-full shadow-softLg
        bg-[#25D366] hover:bg-[#1ebe5b] transition-all duration-300 hover:scale-105 active:scale-95
        w-14 h-14 sm:w-16 sm:h-16
        bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4
        sm:bottom-6 sm:right-6"
    >
      <svg viewBox="0 0 32 32" width="30" height="30" fill="white" aria-hidden="true">
        <path d="M16.01 3C9.38 3 4 8.38 4 15.01c0 2.2.59 4.27 1.62 6.05L4 29l8.12-1.58a12.9 12.9 0 0 0 3.89.6h.01c6.63 0 12.01-5.38 12.01-12.01C28 8.38 22.64 3 16.01 3zm0 21.86h-.01a10.8 10.8 0 0 1-3.55-.63l-.25-.09-4.82.94.94-4.7-.16-.26a10.78 10.78 0 0 1-1.64-5.12c0-5.97 4.85-10.82 10.83-10.82 2.89 0 5.61 1.13 7.65 3.17a10.75 10.75 0 0 1 3.17 7.66c0 5.97-4.86 10.85-10.16 10.85zm5.94-8.11c-.32-.16-1.9-.94-2.2-1.05-.3-.11-.51-.16-.73.16-.21.32-.84 1.05-1.03 1.26-.19.21-.38.24-.7.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.6-1.9-1.78-2.22-.19-.32-.02-.49.14-.65.14-.14.32-.38.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.73-1.76-1-2.41-.26-.63-.53-.54-.73-.55h-.62c-.21 0-.56.08-.85.4-.29.32-1.11 1.09-1.11 2.65 0 1.56 1.14 3.07 1.3 3.28.16.21 2.24 3.42 5.42 4.8.76.33 1.35.52 1.81.67.76.24 1.45.21 2 .13.61-.09 1.9-.78 2.17-1.53.27-.75.27-1.4.19-1.53-.08-.13-.29-.21-.61-.37z" />
      </svg>
    </a>
  );
}
