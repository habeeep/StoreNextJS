export interface NewsResponse {
  totalCount: number;
  limit: number;
  offset: number;
  currentValues: NewsItem[];
}

export interface NewsItem {
  id: string;
  title: string;
  text: string;
  likesCount: number;
  watchCount: number;
  commentsCount: number;
  created: string;
  updated: string;
  images?: string[];
}

export interface News {
  id: string;
  title: string;
  description: string;
  content: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
  likesCount: number;
  viewsCount: number;
  commentsCount: number;
  isLiked: boolean;
  isFavorite: boolean;
  author: {
    id: string;
    name: string;
    surname: string;
  };
}

export interface Comment {
  id: string;
  text: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    surname: string;
  };
}

export type SortOption = 'date-desc' | 'date-asc' | 'popularity-desc' | 'popularity-asc';

export interface NewsFilters {
  sortBy: SortOption;
  showFavoritesOnly: boolean;
}