'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Container } from '@/components/layout/Container/Container';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import { CrossIcon } from '@/components/ui/icons/CrossIcon';
import styles from './page.module.css';

export default function EditNewsPage() {
  const params = useParams();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const newsId = params.id as string;

  useEffect(() => {
    // TODO: Запрос к API за данными новости
    // Моковые данные
    setTitle('Новое поступление тропических растений');
    setDescription('В нашем магазине появились редкие виды растений из тропических лесов');
    setImages(['/images/news/hero1.png']);
    setIsLoading(false);
  }, [newsId]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Отправка на бекенд
    console.log('Сохранение новости:', { title, description, images });
    
    router.push(`/admin/news/${newsId}`);
  };

  const handleDelete = () => {
    if (confirm('Удалить новость?')) {
      // TODO: Отправка на бекенд
      console.log('Удаление новости:', newsId);
      
      router.push('/admin/news');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // TODO: Загрузка изображений
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

  if (isLoading) return <div>Загрузка...</div>;

  return (
    <Container>
      <div className={styles.page}>
        {/* Кнопка назад */}
        <button 
          className={styles.backButton}
          onClick={() => router.push(`/admin/news/${newsId}`)}
          aria-label="Назад"
        >
          <CrossIcon size={24} />
        </button>

        <h1 className={styles.title}>Редактирование новости</h1>

        <form onSubmit={handleSave} className={styles.form}>
          {/* Название */}
          <div className={styles.field}>
            <label className={styles.label}>Название</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Описание */}
          <div className={styles.field}>
            <label className={styles.label}>Описание</label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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

          {/* Кнопки */}
          <div className={styles.actions}>
            <Button type="submit" variant="primary">
              Сохранить изменения
            </Button>
            
            <Button 
              type="button" 
              // variant="danger"
              onClick={handleDelete}
            >
              Удалить новость
            </Button>
          </div>
        </form>
      </div>
    </Container>
  );
}