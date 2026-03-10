import Link from 'next/link';
import { ReactNode } from 'react';
import UserMenu from '../components/UserMenu';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-6 fixed h-full">
        <h1 className="text-2xl font-bold mb-8">Blog Admin</h1>
        <nav className="space-y-4">
          <Link
            href="/posts"
            className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors"
          >
            All Posts
          </Link>
          <Link
            href="/posts/create"
            className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors"
          >
            Create Post
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex justify-end">
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
