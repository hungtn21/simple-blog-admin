import { ReactNode } from 'react';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import UserMenu from '../../components/UserMenu';
import LanguageSwitcher from '../../components/LanguageSwitcher';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const t = await getTranslations('nav');

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-6 fixed h-full">
        <h1 className="text-2xl font-bold mb-8">{t('blogAdmin')}</h1>
        <nav className="space-y-4">
          <Link
            href="/posts"
            className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors"
          >
            {t('allPosts')}
          </Link>
          <Link
            href="/posts/create"
            className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors"
          >
            {t('createPost')}
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex justify-between items-center">
            <LanguageSwitcher />
            <UserMenu />
          </div>
        </header>
        
        {/* Content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
