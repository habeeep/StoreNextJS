'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import { LinkButton } from '@/components/ui/LinkButton/LinkButton';
import { verifyCode, resendCode } from '@/store/slices/authSlice';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import styles from './page.module.css'

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get('email') || '';
  
  const [email, setEmail] = useState(emailFromUrl);
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  
  const dispatch = useAppDispatch();
  const { user, isLoading, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(verifyCode({ email, code }));
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;
    
    setCountdown(60);
    
    try {
      await dispatch(resendCode({ email })).unwrap();
    } catch (error) {
    }
  };

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
          
          {error && <p className={styles.error}>{error}</p>}
          
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
          
          <LinkButton 
            onClick={handleResendCode}
            disabled={countdown > 0}
          >
            {countdown > 0 
              ? `Запросить код повторно ${countdown}сек` 
              : 'Запросить код повторно'
            }
          </LinkButton>
        </div>
      </div>
    </div>
  );
}