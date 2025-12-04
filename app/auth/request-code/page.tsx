'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import { authApi } from '@/lib/api/authApi';
import styles from './page.module.css'

export default function RequestCodePage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await authApi.requestCode({ email });
      router.push(`/auth/login?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError('Ошибка при отправке кода');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <p className={styles.title}>Добро пожаловать!</p>
          <p className={styles.subtitle}>Введите почту чтобы войти или зарегестрироваться</p>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            type="email"
            placeholder="Email:"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            showClearButton
            onClear={() => setEmail('')}
            required
            disabled={isLoading}
          />
          
          {error && <p>{error}</p>}
          
          <Button
            type="submit"
            isLoading={isLoading}
          >
            Получить код
          </Button>
        </form>
      </div>
    </div>
  );
}