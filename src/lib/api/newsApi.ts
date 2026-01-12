import {
  NewsResponse,
  NewsItem,
  CreateNewsRequest,
  UpdateNewsRequest,
  CreateCommentRequest,
  UserActionRequest,
  PaginationParams,
  FavouritesParams,
  NewsOperationResponse,
  ApiComment,
} from '@/types/news';

const API_BASE = process.env.NEXT_PUBLIC_API_URL_FEED;

export const newsApi = {
  // Получить все новости с пагинацией
  async getNews(params?: PaginationParams): Promise<NewsResponse> {
    const limit = params?.limit || 100;
    const offset = params?.offset || 0;
    
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

  // Получить одну новость по ID
  async getNewsById(feedId: string): Promise<NewsItem> {
    const response = await fetch(
      `${API_BASE}/${feedId}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    );
    
    if (!response.ok) {
      throw new Error('Ошибка при получении новости');
    }
    
    return await response.json();
  },

  // Создать новость
  async createNews(data: CreateNewsRequest): Promise<NewsOperationResponse> {
    const response = await fetch(
      `${API_BASE}/`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }
    );
    
    if (!response.ok) {
      throw new Error('Ошибка при создании новости');
    }
    
    return await response.json();
  },

  // Обновить новость
  async updateNews(feedId: string, data: UpdateNewsRequest): Promise<NewsOperationResponse> {
    const response = await fetch(
      `${API_BASE}/${feedId}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }
    );
    
    if (!response.ok) {
      throw new Error('Ошибка при обновлении новости');
    }
    
    return await response.json();
  },

  // Удалить новость
  async deleteNews(feedId: string): Promise<void> {
    const response = await fetch(
      `${API_BASE}/${feedId}`,
      {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      }
    );
    
    if (!response.ok) {
      throw new Error('Ошибка при удалении новости');
    }
  },

  // Получить избранные новости
  async getFavourites(params: FavouritesParams): Promise<NewsResponse> {
    const limit = params.limit || 100;
    const offset = params.offset || 0;
    const userMail = encodeURIComponent(params.user_mail);
    
    const response = await fetch(
      `${API_BASE}/favourites?user_mail=${userMail}&limit=${limit}&offset=${offset}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    );
    
    if (!response.ok) {
      throw new Error('Ошибка при получении избранных новостей');
    }
    
    return await response.json();
  },

  // Добавить новость в избранное
  async addToFavourites(feedId: string, userMail: string): Promise<void> {
    const encodedUserMail = encodeURIComponent(userMail);
    
    const response = await fetch(
      `${API_BASE}/${feedId}/star?user_mail=${encodedUserMail}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }
    );
    
    if (!response.ok) {
      throw new Error('Ошибка при добавлении в избранное');
    }
  },

  // Удалить новость из избранного
  async removeFromFavourites(feedId: string, userMail: string): Promise<void> {
    const encodedUserMail = encodeURIComponent(userMail);
    
    const response = await fetch(
      `${API_BASE}/${feedId}/unstar?user_mail=${encodedUserMail}`,
      {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      }
    );
    
    if (!response.ok) {
      throw new Error('Ошибка при удалении из избранного');
    }
  },

  // Поставить лайк новости
  async likeNews(feedId: string, userMail: string): Promise<void> {
    const encodedUserMail = encodeURIComponent(userMail);
    
    const response = await fetch(
      `${API_BASE}/${feedId}/like?user_mail=${encodedUserMail}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }
    );
    
    if (!response.ok) {
      throw new Error('Ошибка при добавлении лайка');
    }
  },

  // Убрать лайк с новости
  async unlikeNews(feedId: string, userMail: string): Promise<void> {
    const encodedUserMail = encodeURIComponent(userMail);
    
    const response = await fetch(
      `${API_BASE}/${feedId}/unlike?user_mail=${encodedUserMail}`,
      {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      }
    );
    
    if (!response.ok) {
      throw new Error('Ошибка при удалении лайка');
    }
  },

  // Создать комментарий
  async createComment(data: CreateCommentRequest): Promise<ApiComment> {
    const response = await fetch(
      `${API_BASE}/comment`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }
    );
    
    if (!response.ok) {
      throw new Error('Ошибка при создании комментария');
    }
    
    return await response.json();
  },
};