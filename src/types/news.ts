export interface NewsResponse {
  totalCount: number;
  limit: number;
  offset: number;
  currentValues: NewsItem[];
}

export interface ApiComment {
  id: string;
  text: string;
  userMail: string;
  feedId: string;
  created: string;
  updated: string | null;
}

export interface NewsItem {
  id: string;
  title: string;
  text: string;
  comments: ApiComment[] | null;
  likesCount: number;
  watchCount: number;
  commentsCount: number;
  created: string;
  updated: string | null;
  images?: string[];
}

export interface CreateNewsRequest {
  title: string;
  text: string;
}

export interface UpdateNewsRequest {
  title: string;
  text: string;
}

export interface CreateCommentRequest {
  text: string;
  userMail: string;
  feedId: string;
}

export interface UserActionRequest {
  userMail: string;
}

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface FavouritesParams extends PaginationParams {
  user_mail: string;
}

export interface NewsOperationResponse {
  id: string;
  title: string;
  text: string;
  comments: ApiComment[] | null;
  likesCount: number;
  watchCount: number;
  commentsCount: number;
  created: string;
  updated: string | null;
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