'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/layout/Container/Container';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import { CrossIcon } from '@/components/ui/icons/CrossIcon';
import styles from './page.module.css';

export default function CreateNewsPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Отправка на бекенд
    console.log('Создание новости:', { title, description, images });
    
    // После создания переходим обратно
    router.push('/admin/news');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // TODO: Загрузка изображений
    const files = e.target.files;
    if (files) {
      // Моковая загрузка
      const newImages = Array.from(files).map(file => 
        URL.createObjectURL(file)
      );
      setImages([...images, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Container>
      <div className={styles.page}>
        {/* Кнопка назад */}
        <button 
          className={styles.backButton}
          onClick={() => router.back()}
          aria-label="Назад"
        >
          <CrossIcon size={24} />
        </button>

        <h1 className={styles.title}>Создание новости</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Название */}
          <div className={styles.field}>
            <label className={styles.label}>Название</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Введите название новости"
              required
            />
          </div>

          {/* Описание */}
          <div className={styles.field}>
            <label className={styles.label}>Описание</label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Введите описание новости"
              required
            />
          </div>

          {/* Изображения */}
          <div className={styles.field}>
            <label className={styles.label}>Изображения</label>
            
            <div className={styles.imagesPreview}>
              {images.map((image, index) => (
                <div key={index} className={styles.imageItem}>
                  <img src={image} alt={`Изображение ${index + 1}`} />
                  <button
                    type="button"
                    className={styles.removeImage}
                    onClick={() => removeImage(index)}
                    aria-label="Удалить изображение"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className={styles.fileInput}
              id="imageUpload"
            />
            <label htmlFor="imageUpload" className={styles.uploadButton}>
              + Добавить изображения
            </label>
          </div>

          {/* Кнопка создания */}
          <div className={styles.actions}>
            <Button type="submit" variant="primary">
              Создать новость
            </Button>
          </div>
        </form>
      </div>
    </Container>
  );
}