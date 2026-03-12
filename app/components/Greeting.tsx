'use client'

import { useTranslations } from 'next-intl';

export default function Greeting() {
  const t = useTranslations();
  
  return (
    <div className="flex h-screen items-center justify-center">
      <h1 className="text-4xl font-bold">{t('greeting')}</h1>
    </div>
  );
}
