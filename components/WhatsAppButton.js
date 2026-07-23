'use client';

import Image from 'next/image';
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
        w-14 h-14 sm:w-16 sm:h-16 p-3 sm:p-3.5
        bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4
        sm:bottom-6 sm:right-6"
    >
      <Image
        src="/whatsapp-icon.svg"
        alt=""
        width={32}
        height={32}
        className="w-full h-full object-contain"
      />
    </a>
  );
}
