import { NewsResponse } from '@/types/news';

const API_BASE = process.env.NODE_ENV === 'development' 
  ? '/backend/news' 
  : process.env.NEXT_PUBLIC_API_URL_NEWS;

export const newsApi = {
  async getNews(
    limit: number = 100, 
    offset: number = 0
  ): Promise<NewsResponse> {
    console.log(process.env.NODE_ENV);
    const response = await fetch(
      `${API_BASE}/?limit=${limit}&offset=${offset}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    );
    
    if (!response.ok) {
      throw new Error('Ошибка при получении новостей');
    }
    
    return await response.json();
  },
};