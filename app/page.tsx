'use client';

import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/hooks/useAppSelector';
import { logout } from '@/store/slices/authSlice';
import { AppDispatch } from '@/store';
import { Button } from '@/components/ui/Button/Button';
import styles from './page.module.css'

export default function HomePage() {
  const { user, isLoading } = useAppSelector((state) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  if (isLoading) {
    return (
      <div>
        <p>Загрузка...</p>
      </div>
    );
  }


  return (
    <div className={styles.container}>
      <div>
        <h1>Plants Market</h1>
        <p>Ваш рынок растений - находите, покупайте, выращивайте</p>
        
        {user ? (
          <div>
            <h2>Добро пожаловать, {user.name} {user.surname}!</h2>
            <p>Email: {user.email}</p>
            <Button 
              onClick={() => dispatch(logout())}
              variant="secondary"
            >
              Выйти
            </Button>
          </div>
        ) : (
          <div>
            <Link href="/auth/request-code">
              <Button>
                Войти
              </Button>
            </Link>
            
            <Link href="/marketplace">
              <Button variant="secondary">
                Войти как гость
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}