import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useUser } from '../context/user';

export default function useCheckAuth() {
  const router = useRouter();
  const { user } = useUser();
  const [initialized, toggleInitialized] = useState(false);

  useEffect(() => {
    if (!user) {
      router.replace('/');
    } else {
      toggleInitialized(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return initialized;
}
