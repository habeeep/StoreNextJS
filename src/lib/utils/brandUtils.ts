import { ApiBrand, Brand } from '@/types/brand';

export function convertApiBrandToBrand(apiBrand: ApiBrand): Brand {
  return {
    id: apiBrand.id,
    title: apiBrand.title,
    country: apiBrand.country,
    description: apiBrand.description,
  };
}

export function convertApiBrandsToBrands(apiBrands: ApiBrand[]): Brand[] {
  return apiBrands.map(convertApiBrandToBrand);
}

export function searchBrands(brands: Brand[], query: string): Brand[] {
  if (!query.trim()) return brands;

  const searchLower = query.toLowerCase();
  return brands.filter(brand => 
    brand.title.toLowerCase().includes(searchLower) ||
    brand.country.toLowerCase().includes(searchLower) ||
    brand.description.toLowerCase().includes(searchLower)
  );
}

export function sortBrands(
  brands: Brand[], 
  field: 'title' | 'country' = 'title',
  order: 'asc' | 'desc' = 'asc'
): Brand[] {
  return [...brands].sort((a, b) => {
    const valueA = a[field].toLowerCase();
    const valueB = b[field].toLowerCase();
    const comparison = valueA.localeCompare(valueB);
    return order === 'asc' ? comparison : -comparison;
  });
}

export function getBrandById(brands: Brand[], id: string): Brand | undefined {
  return brands.find(brand => brand.id === id);
}

export function getBrandOptions(brands: Brand[]): Array<{ value: string; label: string }> {
  return brands.map(brand => ({
    value: brand.id,
    label: `${brand.title} (${brand.country})`,
  }));
}