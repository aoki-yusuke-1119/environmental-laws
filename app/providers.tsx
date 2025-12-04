'use client';

import { useEffect } from 'react';
import { SessionProvider, useSession } from 'next-auth/react';
import { Provider as JotaiProvider, useSetAtom } from 'jotai';
import { currentUserAtom } from '@/stores/auth';

// セッション情報をatomに同期するコンポーネント
function AuthSync({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const setCurrentUser = useSetAtom(currentUserAtom);

  useEffect(() => {
    if (session?.user) {
      setCurrentUser({
        id: (session.user as any).id || session.userId,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        role: (session.user as any).role,
        username: (session.user as any).username,
      });
    } else {
      setCurrentUser(null);
    }
  }, [session, setCurrentUser]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <JotaiProvider>
      <SessionProvider>
        <AuthSync>{children}</AuthSync>
      </SessionProvider>
    </JotaiProvider>
  );
}
