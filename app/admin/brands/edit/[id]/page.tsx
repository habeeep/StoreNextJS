// app/admin/brands/edit/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Container } from '@/components/layout/Container/Container';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import { CrossIcon } from '@/components/ui/icons/CrossIcon';
import { brandsApi } from '@/lib/api/brandsApi';
import styles from './page.module.css';

export default function EditBrandPage() {
  const params = useParams();
  const router = useRouter();
  const brandId = params.id as string;
  
  const [title, setTitle] = useState('');
  const [country, setCountry] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrand = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const brandData = await brandsApi.getBrandById(brandId);
        setTitle(brandData.title);
        setCountry(brandData.country);
        setDescription(brandData.description);
      } catch (err) {
        console.error('Ошибка при загрузке бренда:', err);
        setError(err instanceof Error ? err.message : 'Не удалось загрузить бренд');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrand();
  }, [brandId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    
    try {
      await brandsApi.updateBrand(brandId, {
        title,
        country,
        description,
      });
      
      router.push(`/admin/brands`);
      
    } catch (err) {
      console.error('Ошибка при сохранении бренда:', err);
      setSaveError(err instanceof Error ? err.message : 'Произошла ошибка при сохранении бренда');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Удалить бренд? Это действие нельзя отменить.')) {
      return;
    }
    
    setIsDeleting(true);
    try {
      await brandsApi.deleteBrand(brandId);
      router.push('/admin/brands');
      
    } catch (err) {
      console.error('Ошибка при удалении бренда:', err);
      alert('Не удалось удалить бренд. Попробуйте снова.');
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/brands');
  };

  if (isLoading) return (
    <Container>
      <div className={styles.loading}>Загрузка бренда...</div>
    </Container>
  );

  if (error) return (
    <Container>
      <div className={styles.errorContainer}>
        <h2>Ошибка загрузки</h2>
        <p className={styles.errorMessage}>{error}</p>
        <div className={styles.errorActions}>
          <Button onClick={() => router.push('/admin/brands')}>
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
      <div className={styles.page}>
        {/* Кнопка назад */}
        <button 
          className={styles.backButton}
          onClick={handleCancel}
          aria-label="Назад"
          disabled={isSaving || isDeleting}
        >
          <CrossIcon size={24} />
        </button>

        <h1 className={styles.title}>Редактирование бренда</h1>

        {saveError && (
          <div className={styles.saveError}>
            {saveError}
          </div>
        )}

        <form onSubmit={handleSave} className={styles.form}>
          {/* Название */}
          <div className={styles.field}>
            <label className={styles.label}>Название *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isSaving || isDeleting}
              placeholder="Введите название бренда"
            />
          </div>

          {/* Страна */}
          <div className={styles.field}>
            <label className={styles.label}>Страна *</label>
            <Input
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
              disabled={isSaving || isDeleting}
              placeholder="Введите страну"
            />
          </div>

          {/* Описание */}
          <div className={styles.field}>
            <label className={styles.label}>Описание *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              disabled={isSaving || isDeleting}
              rows={6}
              className={styles.textarea}
              placeholder="Введите описание бренда"
            />
          </div>

          {/* Кнопки */}
          <div className={styles.actions}>
            <Button 
              type="submit" 
              variant="primary"
              disabled={isSaving || isDeleting}
            >
              {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
            </Button>
            
            <Button 
              type="button" 
              variant="secondary"
              onClick={handleCancel}
              disabled={isSaving || isDeleting}
            >
              Отмена
            </Button>
            
            <Button 
              type="button"
              onClick={handleDelete}
              disabled={isSaving || isDeleting}
              className={styles.deleteButton}
            >
              {isDeleting ? 'Удаление...' : 'Удалить бренд'}
            </Button>
          </div>
        </form>
      </div>
    </Container>
  );
}