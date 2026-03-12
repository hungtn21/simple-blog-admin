"use client";

import { useEffect, useActionState } from 'react';
import { Link } from '@/i18n/navigation';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useFormStatus } from 'react-dom';
import { createPostAction, type PostFormState } from '@/app/actions/posts';

function SubmitButton() {
    const { pending } = useFormStatus();
    const t = useTranslations('createPost');
    
    return (
        <button
            type="submit"
            disabled={pending}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
            {pending ? t('creatingButton') : t('createButton')}
        </button>
    );
}

const initialState: PostFormState = {
    success: false,
};

export default function CreatePostPage() {
    const t = useTranslations('createPost');
    const router = useRouter();
    const [state, formAction] = useActionState(createPostAction, initialState);

    useEffect(() => {
        if (state.success) {
            router.push('/posts');
        }
    }, [state.success, router]);

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

            {state.message && (
                <div className={`px-4 py-3 rounded mb-4 ${
                    state.success 
                        ? 'bg-green-100 border border-green-400 text-green-700' 
                        : 'bg-red-100 border border-red-400 text-red-700'
                }`}>
                    {state.message}
                </div>
            )}

            <form action={formAction} className="bg-white rounded-lg shadow-md p-6 space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('titleLabel')} <span className="text-red-500">{t('required')}</span>
                    </label>
                    <input
                        id="title"
                        name="title"
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={t('titlePlaceholder')}
                        required
                    />
                    {state.errors?.title && (
                        <p className="mt-1 text-sm text-red-600">{state.errors.title[0]}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('contentLabel')} <span className="text-red-500">{t('required')}</span>
                    </label>
                    <textarea
                        id="content"
                        name="content"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={t('contentPlaceholder')}
                        rows={10}
                        required
                    />
                    {state.errors?.content && (
                        <p className="mt-1 text-sm text-red-600">{state.errors.content[0]}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('authorLabel')} <span className="text-red-500">{t('required')}</span>
                    </label>
                    <input
                        id="author"
                        name="author"
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={t('authorPlaceholder')}
                        required
                    />
                    {state.errors?.author && (
                        <p className="mt-1 text-sm text-red-600">{state.errors.author[0]}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('categoryLabel')} <span className="text-red-500">{t('required')}</span>
                    </label>
                    <input
                        id="category"
                        name="category"
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={t('categoryPlaceholder')}
                        required
                    />
                    {state.errors?.category && (
                        <p className="mt-1 text-sm text-red-600">{state.errors.category[0]}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('imageLabel')} <span className="text-red-500">{t('required')}</span>
                    </label>
                    <input
                        id="image"
                        name="image"
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={t('imagePlaceholder')}
                        required
                    />
                    {state.errors?.image && (
                        <p className="mt-1 text-sm text-red-600">{state.errors.image[0]}</p>
                    )}
                </div>

                <div className="flex gap-4">
                    <SubmitButton />
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
