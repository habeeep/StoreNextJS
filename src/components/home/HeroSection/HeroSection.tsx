'use client';

import styles from './HeroSection.module.css';
import Image from 'next/image';
import { ImageContainer } from '@/components/ui/ImageContainer/ImageContainer';

interface FeatureItem {
  id: number;
  number: number;
  title: string;
  description: string;
}

export const HeroSection = () => {
  const leftFeatures: FeatureItem[] = [
    { id: 1, number: 1, title: 'Низкие цены', description: 'Самые низкие цены на рынке зелени.' },
    { id: 2, number: 2, title: 'Помощь с уходом', description: 'Наши специалисты подскажут как правильно ухаживать за растениями.' },
    { id: 3, number: 3, title: 'Высокое качество', description: 'Высший сорт растений от лучших поставщиков страны.' },
  ];

  const rightFeatures: FeatureItem[] = [
    { id: 4, number: 4, title: 'Бесплатная доставка', description: 'Мы уверены, что ваши растения доедут к вам в сохранности.' },
    { id: 5, number: 5, title: 'Широкий выбор', description: 'Подберем вам растение по душе. У нас есть все!' },
    { id: 6, number: 6, title: 'Озеленение дома', description: 'Наши дизайнеры сделают все необходимое, чтобы сделать ваш дом зеленым' },
  ];

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        
        <div className={styles.featuresList}>
          {leftFeatures.map((feature) => (
            <div key={feature.id} className={styles.featureItem}>
              <div className={styles.featureNumber}>{feature.number}</div>
              <div className={styles.featureContent}>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <ImageContainer
          aspectRatio='portrait'
          className={styles.imageContainer}
        >
          <Image
            src='/images/home/hero.png'
            alt='Растение'
            fill
            sizes='(max-width: 490px) 100vw, 1200px'
            priority
            className={styles.image}
          />
        </ImageContainer>

        <div className={styles.featuresList}>
          {rightFeatures.map((feature) => (
            <div key={feature.id} className={styles.featureItem}>
              <div className={styles.featureNumber}>{feature.number}</div>
              <div className={styles.featureContent}>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};