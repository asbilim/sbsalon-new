export interface ServiceCategoryDetails {
  id: number;
  name: string;
  name_en: string;
  name_de: string;
  name_fr: string;
  description: string;
  description_en: string;
  description_de: string;
  description_fr: string;
}

export interface Service {
  id: number;
  category_name: string;
  category_details: ServiceCategoryDetails;
  name: string;
  name_en: string;
  name_de: string;
  name_fr: string;
  base_price: string;
  duration_minutes: number;
  description: string;
  description_en: string;
  description_de: string;
  description_fr: string;
  is_active: boolean;
  category: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
