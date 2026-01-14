'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store';

interface ReduxProviderProps {
  children: React.ReactNode;
}

export function ReduxProvider({ children }: ReduxProviderProps) {
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem('auth_v1');
      if (raw) {
        const parsed = JSON.parse(raw);
        // dispatch directly to store to avoid hook/useDispatch before Provider
        store.dispatch({ type: 'auth/setCredentials', payload: parsed });
      }
    } catch {}
  }, []);

  return <Provider store={store}>{children}</Provider>;
}