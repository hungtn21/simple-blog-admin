"use client";

import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export default function CreatePostPage() {
    const t = useTranslations('createPost');
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        author: '',
        category: '',
        image: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    date: new Date().toISOString().split('T')[0],
                }),
            });

            if (!response.ok) {
                throw new Error(t('errorCreating'));
            }

            router.push('/posts');
        } catch (err) {
            setError(err instanceof Error ? err.message : t('errorGeneric'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl">
            <Link
                href="/posts"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
            >
                <ArrowLeft size={20} />
                {t('backToAllPosts')}
            </Link>

            <h1 className="text-4xl font-bold mb-6">{t('title')}</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('titleLabel')} <span className="text-red-500">{t('required')}</span>
                    </label>
                    <input
                        id="title"
                        name="title"
                        type="text"
                        value={formData.title}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={t('titlePlaceholder')}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('contentLabel')} <span className="text-red-500">{t('required')}</span>
                    </label>
                    <textarea
                        id="content"
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={t('contentPlaceholder')}
                        rows={10}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('authorLabel')} <span className="text-red-500">{t('required')}</span>
                    </label>
                    <input
                        id="author"
                        name="author"
                        type="text"
                        value={formData.author}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={t('authorPlaceholder')}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('categoryLabel')} <span className="text-red-500">{t('required')}</span>
                    </label>
                    <input
                        id="category"
                        name="category"
                        type="text"
                        value={formData.category}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={t('categoryPlaceholder')}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('imageLabel')} <span className="text-red-500">{t('required')}</span>
                    </label>
                    <input
                        id="image"
                        name="image"
                        type="text"
                        value={formData.image}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={t('imagePlaceholder')}
                        required
                    />
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? t('creatingButton') : t('createButton')}
                    </button>
                    <Link
                        href="/posts"
                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                    >
                        {t('cancelButton')}
                    </Link>
                </div>
            </form>
        </div>
    );
}
