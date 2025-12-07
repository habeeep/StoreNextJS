'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from './CategoriesCards.module.css'

interface CardItem {
  id: number;
  title: string;
  href: string;
  imagePath: string;
  buttonText: string;
}

export const CategoriesCards = () => {
  const cards: CardItem[] = [
    { 
      id: 1, 
      title: 'Для домашнего комфорта',
      href: '/catalog/for-home-comfort',
      imagePath: '/images/home/plants1.png',
      buttonText: 'Выбрать'
    },
    { 
      id: 2, 
      title: 'Экзотические растения',
      href: '/catalog/exotic-plants',
      imagePath: '/images/home/plants2.png',
      buttonText: 'Выбрать'
    },
    { 
      id: 3, 
      title: 'Цветущие растения',
      href: '/catalog/flowering-plants',
      imagePath: '/images/home/plants3.png',
      buttonText: 'Выбрать'
    },
  ];

  return (
    <section className={styles.categories}>
      <div className={styles.container}>
        {cards.map((card) => (
          <div key={card.id} className={styles.card}>
            <Image
              src={card.imagePath}
              alt='Растение'
              fill
              sizes='(max-width: 490px) 100vw, 1200px'
              priority
              className={styles.image}
            />
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>{card.title}</h3>
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