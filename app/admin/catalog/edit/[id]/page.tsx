'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/layout/Container/Container';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import { CrossIcon } from '@/components/ui/icons/CrossIcon';
import { ApiBrand } from '@/types/brand';
import { CategoryNode } from '@/types/category';
import { catalogApi } from '@/lib/api/catalogApi';
import { brandsApi } from '@/lib/api/brandsApi';
import { categoriesApi } from '@/lib/api/categoriesApi';
import { buildCategoryTree } from '@/lib/utils/categoryUtils';
import CategoryTreeSelect from '../../components/CategoryTreeSelect/CategoryTreeSelect';
import styles from './page.module.css';

interface ProductFormData {
  title: string;
  description: string;
  price: number;
  categoryId: string;
  brandId: string;
  amount: number;
}

export default function CreateProductPage() {
  const router = useRouter();
  
  const [brands, setBrands] = useState<ApiBrand[]>([]);
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    description: '',
    price: 0,
    categoryId: '',
    brandId: '',
    amount: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true);
      try {
        const [apiBrands, apiCategories] = await Promise.all([
          brandsApi.getAllBrands(),
          categoriesApi.getAllCategories(),
        ]);
        
        setBrands(apiBrands);
        const categoryTree = buildCategoryTree(apiCategories);
        setCategories(categoryTree);
      } catch (err) {
        console.error('Ошибка при загрузке данных:', err);
        setError('Не удалось загрузить бренды и категории');
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (field: keyof ProductFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      await catalogApi.createProduct({
        title: formData.title,
        description: formData.description,
        price: formData.price,
        categoryId: formData.categoryId,
        brandId: formData.brandId,
        amount: formData.amount,
      });
      
      router.push('/admin/catalog');
      
    } catch (err) {
      console.error('Ошибка при создании товара:', err);
      setError(err instanceof Error ? err.message : 'Произошла ошибка при создании товара');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/catalog');
  };

  if (isLoadingData) {
    return (
      <Container>
        <div className={styles.loading}>Загрузка данных...</div>
      </Container>
    );
  }

  const getAllCategoriesForSelect = (nodes: CategoryNode[], level = 0): Array<{ id: string; title: string; indent: string }> => {
    let result: Array<{ id: string; title: string; indent: string }> = [];
    
    nodes.forEach(node => {
      const indent = '— '.repeat(level);
      result.push({ id: node.id, title: `${indent}${node.title}`, indent: indent });
      
      if (node.children.length > 0) {
        result = [...result, ...getAllCategoriesForSelect(node.children, level + 1)];
      }
    });
    
    return result;
  };

  const allCategories = getAllCategoriesForSelect(categories);

  return (
    <Container>
      <div className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.title}>Создать товар</h1>
          <button 
            className={styles.backButton}
            onClick={handleCancel}
            aria-label="Назад"
            disabled={isSubmitting}
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
            <label className={styles.label}>Название товара *</label>
            <Input
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Введите название товара"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Описание *</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Введите описание товара"
              required
              disabled={isSubmitting}
              rows={4}
              className={styles.textarea}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Цена (₽) *</label>
            <Input
              type="number"
              value={formData.price || ''}
              onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
              placeholder="Введите цену"
              required
              min="0"
              step="0.01"
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Количество на складе *</label>
            <Input
              type="number"
              value={formData.amount || ''}
              onChange={(e) => handleInputChange('amount', parseInt(e.target.value) || 0)}
              placeholder="Введите количество"
              required
              min="0"
              step="1"
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Категория *</label>
            <div className={styles.categoryTree}>
              {categories.length === 0 ? (
                <div>Категории не загружены</div>
              ) : (
                <CategoryTreeSelect
                  nodes={categories}
                  value={formData.categoryId}
                  onChange={(id: string) => handleInputChange('categoryId', id)}
                  disabled={isSubmitting}
                />
              )}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Бренд *</label>
            <select
              value={formData.brandId}
              onChange={(e) => handleInputChange('brandId', e.target.value)}
              className={styles.select}
              required
              disabled={isSubmitting}
            >
              <option value="">Выберите бренд</option>
              {brands.map(brand => (
                <option key={brand.id} value={brand.id}>
                  {brand.title} ({brand.country})
                </option>
              ))}
            </select>
          </div>

          <div className={styles.actions}>
            <Button 
              type="submit" 
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Создание...' : 'Создать товар'}
            </Button>
            
            <Button 
              type="button" 
              variant="secondary"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Отмена
            </Button>
          </div>
        </form>
      </div>
    </Container>
  );
}