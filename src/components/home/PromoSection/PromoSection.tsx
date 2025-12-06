'use client';

import { Button } from '@/components/ui/Button/Button';
import styles from './PromoSection.module.css'

export const PromoSection = () => {
  return (
    <section className={styles.promo}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          Получи бесплатную<br/> инструкцию по уходу за растениями<br/> за подписку на наши новости
        </h2>
        <Button>
          Подписаться
        </Button>
      </div>
    </section>
  );
};