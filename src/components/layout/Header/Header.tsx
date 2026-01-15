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
import { BriefcaseIcon } from '@/components/ui/icons/BriefcaseIcon';
import { GridIcon } from '@/components/ui/icons/GridIcon';
import { useCustomizer } from '@/hooks/useCustomizer';


export const Header = () => {
  const custom = useCustomizer();
  const { user } = useAppSelector((state) => state.auth);
  const cartCount = useAppSelector((state) => state.cart.items.length);
  
  const dispatch = useAppDispatch();
  const pathname = usePathname();

  const navItems = [
    { label: 'Главная', href: '/', icon: HomeIcon},
    { label: 'Новости', href: '/news', icon: NewsIcon },
    { label: 'Товары', href: '/catalog', icon: CatalogIcon },
  ];

  const adminNavItems = [
    { label: 'Новости', href: '/admin/news', icon: NewsIcon },
    { label: 'Товары', href: '/admin/catalog', icon: CatalogIcon },
    { label: 'Бренды', href: '/admin/brands', icon: BriefcaseIcon },
    { label: 'Категории', href: '/admin/categories', icon: GridIcon },
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

  const isAdmin = user?.role === 'admin';

  return (
    <header className={`${styles.header} ${isAdmin ? styles.headerWithAdmin : ''} ${isAdmin ? 'has-admin' : ''}`}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link href="/" className={styles.logoLink}>
            {custom.title}
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
              <Link href="/profile" className={`${styles.iconLink} ${isActive('/profile') ? styles.iconLinkActive : ''}`} aria-label="Личный кабинет">
                <UserIcon size={24} />
              </Link>
              
              <Link href="/cart" className={`${styles.iconLink} ${styles.iconLinkCart} ${isActive('/cart') ? styles.iconLinkActive : ''}`} aria-label="Корзина">
                <CartIcon size={24} />
                <span className={styles.cartCount}>{cartCount}</span>
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
              <Link href="/cart" className={`${styles.iconLink} ${styles.iconLinkCart} ${isActive('/cart') ? styles.iconLinkActive : ''}`} aria-label="Корзина">
                <CartIcon size={24} />
                <span className={styles.cartCount}>{cartCount}</span>
              </Link>
              
              <Link href="/auth/request-code" className={`${styles.iconLink} ${isActive('/auth') ? styles.iconLinkActive : ''}`} aria-label="Войти">
                <LoginIcon size={24} />
              </Link>
            </>
          )}
        </div>
      </div>

      {isAdmin && (
        <div className={styles.adminRow} aria-label="Админ навигация">
          <div className={styles.adminInner}>
            <nav>
              <ul className={styles.adminNavList}>
                {adminNavItems.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={`${styles.adminNavLink} ${isActive(item.href) ? styles.adminNavLinkActive : ''}`}>
                      <item.icon className={styles.adminNavIcon} />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};