'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { Post } from '@/types/prisma';

const isValidImageUrl = (url: string | null | undefined): boolean => {
  if (!url || typeof url !== 'string' || url.trim() === '') return false;
  
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

export default function Postcard({ post }: { post: Post }) {
  const [imageError, setImageError] = useState(false);
  const hasValidImage = isValidImageUrl(post.image);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h2>
      <p className="text-gray-700 leading-relaxed">{post.content}</p>
      {hasValidImage && !imageError && (
        <Image 
          src={post.image} 
          alt={post.title} 
          width={100} 
          height={100} 
          className="mt-4 rounded"
          onError={() => setImageError(true)}
        />
      )}
    </div>
  );
}
