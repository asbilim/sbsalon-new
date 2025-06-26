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

export interface EmployeeService {
  id: number;
  name: string;
  category: number;
  category_name: string;
  base_price: string;
  duration_minutes: number;
}

export interface Specialty {
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

export interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  specialties: Specialty[];
  specialties_names: string[];
  services: EmployeeService[];
  services_count: number;
  hourly_rate: string;
  is_available: boolean;
  bio: string;
}
