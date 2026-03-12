'use client';

import { Link } from '@/i18n/navigation';
import { Plus } from 'lucide-react';
import Postcard from '@/app/components/Postcard/Postcard';
import { useTranslations } from 'next-intl';
import type { Post } from '@/types/prisma';

interface PostsListProps {
  posts: Post[];
}

export default function PostsList({ posts }: PostsListProps) {
  const t = useTranslations('posts');

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">{t('title')}</h1>
        <Link 
          href="/posts/create"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          {t('create')}
        </Link>
      </div>
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {t('noPosts')}
          </div>
        ) : (
          posts.map((post: Post) => (
            <Link 
              key={post.id} 
              href={`/posts/${post.id}`} 
              className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <Postcard post={post} />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
