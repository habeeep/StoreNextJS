'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/layout/Container/Container';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import { CrossIcon } from '@/components/ui/icons/CrossIcon';
import { newsApi } from '@/lib/api/newsApi';
import styles from './page.module.css';
import { useCustomizer } from '@/hooks/useCustomizer';

export default function CreateNewsPage() {
  const custom = useCustomizer();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await newsApi.createNews({
        title,
        text,
      });
      
      router.push('/admin/news');
      
    } catch (err) {
      console.error('Ошибка при создании новости:', err);
      setError(err instanceof Error ? err.message : 'Произошла ошибка при создании новости');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // TODO: Реализовать загрузку изображений на сервер
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => 
        URL.createObjectURL(file)
      );
      setImages([...images, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleCancel = () => {
    router.push('/admin/news');
  };

  return (
    <Container>
      <div className={styles.page} style={{"--color-custom": `var(--color-${custom.theme}-200)`} as React.CSSProperties}>
        <div className={styles.header}>
          <h1 className={styles.title}>Создание новости</h1>
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
              placeholder="Введите название новости"
              required
              disabled={isLoading}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Текст новости *</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Введите текст новости"
              required
              disabled={isLoading}
              rows={6}
              className={styles.textarea}
              style={{"--color-custom": `var(--color-${custom.theme}-100)`,
          "--color-custom-out": `var(--color-${custom.theme}-500)`} as React.CSSProperties}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Изображения</label>
            
            {images.length > 0 && (
              <div className={styles.imagesPreview}>
                {images.map((image, index) => (
                  <div key={index} className={styles.imageItem}>
                    <img src={image} alt={`Изображение ${index + 1}`} />
                    <button
                      type="button"
                      className={styles.removeImage}
                      onClick={() => removeImage(index)}
                      aria-label="Удалить изображение"
                      disabled={isLoading}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className={styles.fileInput}
              id="imageUpload"
              disabled={isLoading}
            />
          </div>

          <Button 
            type="submit" 
            variant="primary"
            disabled={isLoading}
            className={styles.createButton}
          >
            {isLoading ? 'Создание...' : 'Создать новость'}
          </Button>
        </form>
      </div>
    </Container>
  );
}