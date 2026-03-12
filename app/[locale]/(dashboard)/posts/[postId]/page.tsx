import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { prisma } from '@/lib/prisma';
import { ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    postId: string;
    locale: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { postId } = await params;
  const t = await getTranslations('posts');
  const post = await prisma.post.findUnique({
    where: { id: postId }
  });

  if (!post) {
    return {
      title: t('notFound'),
    };
  }

  return {
    title: post.title,
    description: post.content.substring(0, 160),
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.content.substring(0, 160),
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      images: post.image ? [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.content.substring(0, 160),
      images: post.image ? [post.image] : [],
    },
    keywords: [post.category, 'blog', 'article'],
  };
}

export default async function PostDetailPage({ params }: PageProps) {
  const { postId } = await params;
  const t = await getTranslations('posts');
  
  const post = await prisma.post.findUnique({
    where: { id: postId }
  });

  if (!post) {
    notFound();
  }

  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.content.substring(0, 160),
    image: post.image || '',
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Simple Blog Admin',
    },
    articleBody: post.content,
    articleSection: post.category,
    keywords: [post.category, 'blog', 'article'],
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://simple-blog-admin.vercel.app/posts/${post.id}`,
    },
  };

  return (
    <div className="max-w-4xl">
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Back button */}
      <Link
        href="/posts"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
      > <ArrowLeft />
      {t('backToAllPosts')}
      </Link>

      {/* Post content */}
      <article className="bg-white rounded-lg shadow-md p-8">
        <header className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
          <div className="flex items-center text-gray-600 text-sm space-x-4">
            <span className="flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              {post.author}
            </span>
            <span className="flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {post.date}
            </span>
            <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
              {post.category}
            </span>
          </div>
        </header>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 leading-relaxed">{post.content}</p>
        </div>
      </article>
    </div>
  );
}
