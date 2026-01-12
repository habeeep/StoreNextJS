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
      id: '156f10e2-a035-47a9-833c-96eb28879669',
      title: '',
      href: '/catalog?category=156f10e2-a035-47a9-833c-96eb28879669',
      imagePath: '/images/home/plants1.png',
      buttonText: 'Выбрать'
    },
    {
      id: '157385e3-5278-4b88-9e3a-5fb0df006c42',
      title: '',
      href: '/catalog?category=157385e3-5278-4b88-9e3a-5fb0df006c42',
      imagePath: '/images/home/plants2.png',
      buttonText: 'Выбрать'
    },
    {
      id: 'd4a651f3-700f-4ffc-9e31-6bfd22ecc1e3',
      title: '',
      href: '/catalog?category=d4a651f3-700f-4ffc-9e31-6bfd22ecc1e3',
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