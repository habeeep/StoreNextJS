export interface News {
  id: string;
  title: string;
  description: string;
  content: string;
  images: string[]; // URL изображений
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