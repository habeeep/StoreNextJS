'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import styles from './SliderSection.module.css'

interface SliderCard {
  id: number;
  title: string;
  imagePath: string;
}

export const SliderSection = () => {
  const cards: SliderCard[] = [
    {
      id: 1,
      title: 'Цветы улучшают память! Врачи доказали.',
      imagePath: '/images/news/hero1.png'
    },
    {
      id: 2,
      title: 'Цветы это цветы жизни!',
      imagePath: '/images/news/hero2.png'
    },
    {
      id: 3,
      title: 'Цветы и ты.',
      imagePath: '/images/news/hero3.png'
    },
    {
      id: 4,
      title: 'Ты не ты когда не цветы!',
      imagePath: '/images/news/hero4.png'
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const delay = 5000;

  const resetTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % cards.length);
    }, delay);
  }, [cards.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    resetTimer();
  };

  useEffect(() => {
    resetTimer();
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [resetTimer]);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {cards.map((card, index) => (
          <div
            key={card.id}
            className={`${styles.card} ${
              index === currentSlide ? styles.active : ''
            }`}
          >
            <Image
              src={card.imagePath}
              alt='Растение'
              fill
              sizes='(max-width: 490px) 100vw, 1200px'
              priority={index === 0}
              className={styles.image}
            />
            <div className={styles.cardContent}>
              <h3 className={styles.title}>{card.title}</h3>
              <div className={styles.indicators}>
                {cards.map((_, index) => (
                  <button
                    key={index}
                    className={`${styles.indicator} ${
                      index === currentSlide ? styles.activeIndicator : ''
                    }`}
                    onClick={() => goToSlide(index)}
                    aria-label={`Перейти к слайду ${index + 1}`}
                    type="button"
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};