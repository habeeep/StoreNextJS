'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { logout } from '@/store/slices/authSlice';
import styles from './Header.module.css';

import { CartIcon } from '@/components/ui/icons/CartIcon';
import { UserIcon } from '@/components/ui/icons/UserIcon';
import { LogoutIcon } from '@/components/ui/icons/LogoutIcon';
import { LoginIcon } from '@/components/ui/icons/LoginIcon';
import { HomeIcon } from '@/components/ui/icons/HomeIcon';
import { NewsIcon } from '@/components/ui/icons/NewsIcon';
import { CatalogIcon } from '@/components/ui/icons/CatalogIcon';


export const Header = () => {
  const { user } = useAppSelector((state) => state.auth);
  
  const dispatch = useAppDispatch();
  const pathname = usePathname();

  const navItems = [
    { label: 'Главная', href: '/', icon: HomeIcon},
    { label: 'Новости', href: '/news', icon: NewsIcon },
    { label: 'Товары', href: '/catalog', icon: CatalogIcon },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link href="/" className={styles.logoLink}>
            Plants Market
          </Link>
        </div>
        <nav aria-label="Основная навигация">
          <ul className={styles.navList}>
            {navItems.map((item) => (
              <li key={item.href} className={styles.navItem}>
                <Link href={item.href} className={`${styles.navLink} ${isActive(item.href) ? styles.navLinkActive : ''}`}>
                  <item.icon className={styles.navIcon}/>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.iconsContainer}>
          {user ? (
            <>
              <Link href="/profile" className={styles.iconLink} aria-label="Личный кабинет">
                <UserIcon size={24} />
              </Link>
              
              <Link href="/cart" className={styles.iconLink} aria-label="Корзина">
                <CartIcon size={24} />
                <span className={styles.cartCount}>0</span>
              </Link>
              
              <button
                onClick={handleLogout}
                className={`${styles.iconButton} ${styles.iconLink}`}
                aria-label="Выйти"
              >
                <LogoutIcon size={24} />
              </button>
            </>
          ) : (
            <>
              <Link href="/cart" className={`${styles.iconLink} ${styles.iconLinkCart}`} aria-label="Корзина">
                <CartIcon size={24} />
                <span className={styles.cartCount}>0</span>
              </Link>
              
              <Link href="/auth/request-code" className={styles.iconLink} aria-label="Войти">
                <LoginIcon size={24} />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};