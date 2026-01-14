'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './CategoriesCards.module.css'
import { categoriesApi } from '@/lib/api/categoriesApi';

interface CardItem {
  id: string;
  title: string;
  href: string;
  imagePath: string;
  buttonText: string;
}

export const CategoriesCards = () => {
  const initialCards: CardItem[] = [
    {
      id: 'b766aab7-db75-430e-b549-dae04c00340c',
      title: '',
      href: '/catalog?category=b766aab7-db75-430e-b549-dae04c00340c',
      imagePath: '/images/home/plants1.png',
      buttonText: 'Выбрать'
    },
    {
      id: '944e3be2-955a-4870-aa5d-aa1845f8bd5b',
      title: '',
      href: '/catalog?category=944e3be2-955a-4870-aa5d-aa1845f8bd5b',
      imagePath: '/images/home/plants2.png',
      buttonText: 'Выбрать'
    },
    {
      id: '5441bbfe-7f60-4783-a132-194e7d9a327d',
      title: '',
      href: '/catalog?category=5441bbfe-7f60-4783-a132-194e7d9a327d',
      imagePath: '/images/home/plants3.png',
      buttonText: 'Выбрать'
    },
  ];

  const [cards, setCards] = useState<CardItem[]>(initialCards);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const apiCats = await categoriesApi.getAllCategories();
        if (!mounted) return;

        setCards(prev => prev.map(c => {
          const found = apiCats.find(ac => ac.id === c.id);
          return {
            ...c,
            title: found ? found.title : c.title || 'Категория'
          };
        }));
      } catch (err) {
        console.warn('Не удалось загрузить названия категорий для карточек', err);
      }
    };

    load();
    return () => { mounted = false; };
  }, []);

  return (
    <section className={styles.categories}>
      <div className={styles.container}>
        {cards.map((card) => (
          <div key={card.id} className={styles.card}>
            <Image
              src={card.imagePath}
              alt={card.title || 'Растение'}
              fill
              sizes='(max-width: 490px) 100vw, 1200px'
              priority
              className={styles.image}
            />
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>{card.title || 'Категория'}</h3>
              <Link href={card.href} className={styles.cardLink}>
                {card.buttonText}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};