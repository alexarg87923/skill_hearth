import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchCSRFToken } from './csrf';

interface WithProtectedPageOptions {
  redirectTo?: string;
}

export function withProtectedPage<P>(
  WrappedComponent: React.ComponentType<P>,
  options: WithProtectedPageOptions = {}
) {
  return function ProtectedPageWrapper(props: P) {
    const [csrfToken, setCsrfToken] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
      const checkAuthAndFetchCSRF = async () => {
        try {
          const token = await fetchCSRFToken();
          setCsrfToken(token);
        } catch (err) {
          console.error('Error in protected page:', err);
          if (options.redirectTo) {
            router.replace(options.redirectTo);
          }
        }
      };

      checkAuthAndFetchCSRF();
    }, []);

    if (!csrfToken) {
      return <div>Loading...</div>;
    }

    return <WrappedComponent {...(props as P)} csrfToken={csrfToken} />;
  };
}
