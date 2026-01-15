'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/layout/Container/Container';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import { CrossIcon } from '@/components/ui/icons/CrossIcon';
import { brandsApi } from '@/lib/api/brandsApi';
import styles from './page.module.css';
import { useCustomizer } from '@/hooks/useCustomizer';

export default function CreateBrandPage() {
  const custom = useCustomizer();
  const router = useRouter();
  
  const [title, setTitle] = useState('');
  const [country, setCountry] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      await brandsApi.createBrand({
        title,
        country,
        description,
      });
      
      router.push('/admin/brands');
      
    } catch (err) {
      console.error('Ошибка при создании бренда:', err);
      setError(err instanceof Error ? err.message : 'Произошла ошибка при создании бренда');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/brands');
  };

  return (
    <Container>
      <div className={styles.page} style={{"--color-custom": `var(--color-${custom.theme}-200)`} as React.CSSProperties}>
        <div className={styles.header}>
          <h1 className={styles.title}>Создание бренда</h1>

          <button 
            className={styles.backButton}
            onClick={handleCancel}
            aria-label="Назад"
            disabled={isLoading}
          >
            <CrossIcon size={40} />
          </button>
        </div>
        

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Название *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Введите название бренда"
              required
              disabled={isLoading}
              showClearButton={title.length > 0}
              onClear={() => setTitle('')}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Страна *</label>
            <Input
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Введите страну"
              required
              disabled={isLoading}
              showClearButton={country.length > 0}
              onClear={() => setCountry('')}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Описание *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              disabled={isLoading}
              rows={6}
              className={styles.textarea}
              placeholder="Введите описание бренда"
              style={{"--color-custom": `var(--color-${custom.theme}-100)`,
          "--color-custom-out": `var(--color-${custom.theme}-500)`} as React.CSSProperties}
            />
          </div>

          <div className={styles.actions}>
            <Button 
              type="submit" 
              variant="primary"
              disabled={isLoading}
              className={styles.createButton}
            >
              {isLoading ? 'Создание...' : 'Создать бренд'}
            </Button>
          </div>
        </form>
      </div>
    </Container>
  );
}