'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Container } from '@/components/layout/Container/Container';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import { CrossIcon } from '@/components/ui/icons/CrossIcon';
import { newsApi } from '@/lib/api/newsApi';
import { NewsItem } from '@/types/news';
import styles from './page.module.css';
import { useCustomizer } from '@/hooks/useCustomizer';

export default function EditNewsPage() {
  const custom = useCustomizer();
  const params = useParams();
  const router = useRouter();
  const newsId = params.id as string;
  
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const newsData = await newsApi.getNewsById(newsId);
        setTitle(newsData.title);
        setText(newsData.text);
        setImages(newsData.images || []);
      } catch (err) {
        console.error('Ошибка при загрузке новости:', err);
        setError(err instanceof Error ? err.message : 'Не удалось загрузить новость');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [newsId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    
    try {
      await newsApi.updateNews(newsId, {
        title,
        text,
      });
      
      console.log('Новость обновлена');
      
      router.push(`/admin/news/${newsId}`);
      
    } catch (err) {
      console.error('Ошибка при сохранении новости:', err);
      setSaveError(err instanceof Error ? err.message : 'Произошла ошибка при сохранении новости');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Удалить новость? Это действие нельзя отменить.')) {
      return;
    }
    
    setIsDeleting(true);
    try {
      await newsApi.deleteNews(newsId);
      console.log('Новость удалена');
      
      router.push('/admin/news');
      
    } catch (err) {
      console.error('Ошибка при удалении новости:', err);
      alert('Не удалось удалить новость. Попробуйте снова.');
      setIsDeleting(false);
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
    router.push(`/admin/news/${newsId}`);
  };

  if (isLoading) return (
    <Container>
      <div className={styles.loading}>Загрузка новости...</div>
    </Container>
  );

  if (error) return (
    <Container>
      <div className={styles.errorContainer}>
        <h2>Ошибка загрузки</h2>
        <p className={styles.errorMessage}>{error}</p>
        <div className={styles.errorActions}>
          <Button onClick={() => router.push('/admin/news')}>
            Вернуться к списку
          </Button>
          <Button 
            onClick={() => window.location.reload()}
            variant="secondary"
          >
            Попробовать снова
          </Button>
        </div>
      </div>
    </Container>
  );

  return (
    <Container>
      <div className={styles.page} style={{"--color-custom": `var(--color-${custom.theme}-200)`} as React.CSSProperties}>
        <button 
          className={styles.backButton}
          onClick={handleCancel}
          aria-label="Назад"
          disabled={isSaving || isDeleting}
        >
          <CrossIcon size={24} />
        </button>

        <h1 className={styles.title}>Редактирование новости</h1>

        {saveError && (
          <div className={styles.saveError}>
            {saveError}
          </div>
        )}

        <form onSubmit={handleSave} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Название *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isSaving || isDeleting}
              placeholder="Введите название новости"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Текст новости *</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
              disabled={isSaving || isDeleting}
              rows={8}
              className={styles.textarea}
              placeholder="Введите текст новости"
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
                      disabled={isSaving || isDeleting}
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
              disabled={isSaving || isDeleting}
            />
          </div>

          <div className={styles.actions}>
            <Button 
              type="submit" 
              variant="primary"
              disabled={isSaving || isDeleting}
              className={styles.saveButton}
            >
              {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
            </Button>
          </div>
        </form>
      </div>
    </Container>
  );
}