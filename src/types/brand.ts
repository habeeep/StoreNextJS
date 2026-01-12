export interface ApiBrand {
  id: string;
  title: string;
  country: string;
  description: string;
  created: string;
  updated: string | null;
}

export interface CreateBrandRequest {
  title: string;
  country: string;
  description: string;
}

export interface UpdateBrandRequest {
  title: string;
  country: string;
  description: string;
}

export interface Brand {
  id: string;
  title: string;
  country: string;
  description: string;
}

export interface BrandFormData {
  title: string;
  country: string;
  description: string;
}

export interface BrandForProduct {
  id: string;
  title: string;
}