"use client";

import { signOut, useSession } from "next-auth/react";
import { LogOut, User } from "lucide-react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

export default function UserMenu() {
  const { data: session } = useSession();
  const params = useParams();
  const locale = params.locale || 'en';
  const t = useTranslations('nav');

  if (!session?.user) {
    return null;
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 text-sm">
        <User size={16} className="text-gray-600" />
        <span className="text-gray-700">{session.user.name || session.user.email}</span>
      </div>
      <button
        onClick={() => signOut({ callbackUrl: `/${locale}/login` })}
        className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      >
        <LogOut size={16} />
        {t('logout')}
      </button>
    </div>
  );
}
