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
      id: 'c2ffbade-9961-4a89-ae18-6cfb332f1ee3',
      title: '',
      href: '/catalog?category=c2ffbade-9961-4a89-ae18-6cfb332f1ee3',
      imagePath: '/images/home/plants1.png',
      buttonText: 'Выбрать'
    },
    {
      id: '2e3f5804-ec81-416d-9a49-42b1b679644c',
      title: '',
      href: '/catalog?category=2e3f5804-ec81-416d-9a49-42b1b679644c',
      imagePath: '/images/home/plants2.png',
      buttonText: 'Выбрать'
    },
    {
      id: 'ba6211ad-9443-43a3-96ce-66854fc44368',
      title: '',
      href: '/catalog?category=ba6211ad-9443-43a3-96ce-66854fc44368',
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