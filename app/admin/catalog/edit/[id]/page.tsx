// app/admin/catalog/edit/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Container } from '@/components/layout/Container/Container';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import { CrossIcon } from '@/components/ui/icons/CrossIcon';
import { Product, ProductFormData, Brand, Category } from '@/types/catalog';
import styles from './page.module.css';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  
  // Моковые данные
  const [brands] = useState<Brand[]>([
    { id: '1', name: 'GreenHouse', country: 'Нидерланды', categories: ['1', '2'], description: 'Ведущий производитель растений' },
    { id: '2', name: 'PlantShop', country: 'Германия', categories: ['1'], description: 'Немецкое качество' },
  ]);

  const [categories] = useState<Category[]>([
    {
      id: '1',
      name: 'Комнатные растения',
      subCategories: [
        { id: '11', name: 'Декоративно-лиственные' },
        { id: '12', name: 'Цветущие' },
      ]
    },
    {
      id: '2',
      name: 'Садовые растения',
      subCategories: [
        { id: '21', name: 'Хвойные' },
        { id: '22', name: 'Лиственные деревья' },
      ]
    }
  ]);

  // Состояние формы
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    categories: [],
    brandId: '',
    images: [],
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  // Загрузка данных товара
  useEffect(() => {
    // TODO: Запрос к API за данными товара
    const mockProduct: Product = {
      id: productId,
      name: 'Монстера',
      description: 'Тропическое растение с резными листьями',
      price: 2500,
      imagePath: '/images/catalog/plants1.png',
      categoryId: '1',
      subCategoryId: '11',
      brand: 'GreenHouse',
      inCart: false
    };

    // Преобразование данных товара в форму
    setFormData({
      name: mockProduct.name,
      description: mockProduct.description,
      price: mockProduct.price,
      categories: [mockProduct.categoryId, mockProduct.subCategoryId],
      brandId: '1', // ID бренда на основе названия
      images: [mockProduct.imagePath],
    });

    setExistingImages([mockProduct.imagePath]);
    setIsLoading(false);
  }, [productId]);

  // Обработчики (аналогично созданию)
  const handleInputChange = (field: keyof ProductFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCategoryToggle = (categoryId: string) => {
    setFormData(prev => {
      const newCategories = prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId];
      return { ...prev, categories: newCategories };
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setSelectedFiles(prev => [...prev, ...newFiles]);
      setFormData(prev => ({ 
        ...prev, 
        images: [...prev.images as string[], ...newFiles.map(f => URL.createObjectURL(f))] 
      }));
    }
  };

  const removeImage = (index: number) => {
    if (index < existingImages.length) {
      // Удаление существующего изображения
      setExistingImages(prev => prev.filter((_, i) => i !== index));
    } else {
      // Удаление нового изображения
      const newIndex = index - existingImages.length;
      setSelectedFiles(prev => prev.filter((_, i) => i !== newIndex));
    }
    
    setFormData(prev => ({
      ...prev,
      images: (prev.images as string[]).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Отправка на бекенд
    console.log('Сохранение товара:', { ...formData, images: [...existingImages, ...selectedFiles] });
    
    router.push('/admin/catalog');
  };

  const handleDelete = () => {
    if (confirm('Удалить товар?')) {
      // TODO: Удаление через API
      console.log('Удаление товара:', productId);
      router.push('/admin/catalog');
    }
  };

  const handleCancel = () => {
    router.push('/admin/catalog');
  };

  if (isLoading) return <div>Загрузка...</div>;

  return (
    <Container>
      <div className={styles.page}>
        {/* Кнопка назад */}
        <button 
          className={styles.backButton}
          onClick={handleCancel}
          aria-label="Назад"
        >
          <CrossIcon size={24} />
        </button>

        <h1 className={styles.title}>Редактирование товара</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Поля формы (аналогично созданию) */}
          <div className={styles.field}>
            <label className={styles.label}>Название товара *</label>
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Описание *</label>
            <Input
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Цена (₽) *</label>
            <Input
              type="number"
              value={formData.price || ''}
              onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
              required
              min="0"
              step="0.01"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Категории *</label>
            <div className={styles.categoriesList}>
              {categories.map(category => (
                <div key={category.id} className={styles.categoryGroup}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={formData.categories.includes(category.id)}
                      onChange={() => handleCategoryToggle(category.id)}
                    />
                    <span>{category.name}</span>
                  </label>
                  
                  <div className={styles.subcategories}>
                    {category.subCategories.map(sub => (
                      <label key={sub.id} className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={formData.categories.includes(sub.id)}
                          onChange={() => handleCategoryToggle(sub.id)}
                        />
                        <span>{sub.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Бренд *</label>
            <select
              value={formData.brandId}
              onChange={(e) => handleInputChange('brandId', e.target.value)}
              className={styles.select}
              required
            >
              <option value="">Выберите бренд</option>
              {brands.map(brand => (
                <option key={brand.id} value={brand.id}>
                  {brand.name} ({brand.country})
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Изображения</label>
            
            <div className={styles.imagesPreview}>
              {(formData.images as string[]).map((image, index) => (
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
              variant="secondary"
              onClick={handleCancel}
            >
              Отмена
            </Button>
            
            <Button 
              type="button" 
              // variant="danger" 
              onClick={handleDelete}
            >
              Удалить товар
            </Button>
          </div>
        </form>
      </div>
    </Container>
  );
}