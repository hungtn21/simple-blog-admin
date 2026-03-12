import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getLocale } from 'next-intl/server';

export default async function Home() {
  const session = await getServerSession(authOptions);
  const locale = await getLocale();
  
  if (session) {
    redirect(`/${locale}/posts`);
  } else {
    redirect(`/${locale}/login`);
  }
  
  return null;
}
