import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostById, getPosts } from '@/lib/postsData';
import { ArrowLeft } from 'lucide-react';

interface PageProps {
  params: Promise<{
    postId: string;
  }>;
}

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({
    postId: post.id.toString()
  }));
}

export default async function PostDetailPage({ params }: PageProps) {
  const { postId } = await params;
  
  const post = await getPostById(parseInt(postId));

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-4xl">
      {/* Back button */}
      <Link
        href="/posts"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
      > <ArrowLeft />
      Back to All Posts
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

        {/* Actions */}
        <footer className="mt-8 pt-6 border-t border-gray-200 flex space-x-4">
          <Link
            href={`/posts/${post.id}/edit`}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Edit Post
          </Link>
          <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
            Delete Post
          </button>
        </footer>
      </article>
    </div>
  );
}
