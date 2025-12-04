'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import { LinkButton } from '@/components/ui/LinkButton/LinkButton';
import { loginUser } from '@/store/slices/authSlice';
import { useAppSelector } from '@/hooks/useAppSelector';
import { AppDispatch } from '@/store';
import styles from './page.module.css'


export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get('email') || '';
  
  const [email, setEmail] = useState(emailFromUrl);
  const [code, setCode] = useState('');
  
  const dispatch = useDispatch<AppDispatch>();
  const { user, isLoading, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  useEffect(() => {
    if (emailFromUrl) {
      setEmail(emailFromUrl);
    }
  }, [emailFromUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(loginUser({ email, code }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <p className={styles.title}>
            Введите код
          </p>
          <p className={styles.subtitle}>
            Код отправлен на {email}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.form}>          
          <Input
            placeholder="Код подтверждения"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            disabled={isLoading}
          />
          
          {error && <p>{error}</p>}
          
          <Button
            type="submit"
            isLoading={isLoading}
          >
            Войти
          </Button>
        </form>
        
        <div className={styles.extraButtonsWrapper}>
          <LinkButton onClick={() => window.history.back()}>
            ← Ввести другую почту
          </LinkButton>
          <LinkButton onClick={() => window.history.back()}>
            Запросить код повторно 57сек
          </LinkButton>
        </div>
      </div>
    </div>
  );
}