'use client';

import { useParams } from 'next/navigation';
import { usePathname, useRouter } from '@/i18n/navigation';
import { Languages } from 'lucide-react';

export default function LanguageSwitcher() {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = params.locale as string;

  const switchLanguage = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex items-center gap-2">
      <Languages size={16} className="text-gray-600" />
      <div className="flex gap-1 border border-gray-300 rounded-lg overflow-hidden">
        <button
          onClick={() => switchLanguage('en')}
          className={`px-3 py-1.5 text-sm font-medium transition-colors ${
            currentLocale === 'en'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          EN
        </button>
        <button
          onClick={() => switchLanguage('vi')}
          className={`px-3 py-1.5 text-sm font-medium transition-colors ${
            currentLocale === 'vi'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          VI
        </button>
      </div>
    </div>
  );
}
