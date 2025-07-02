export interface ProductQueryDto {
  min?: string;
  max?: string;
  limit?: string;
  offset?: string;
  searchKey?: string;
}

export interface ProductFilters {
  min: number;
  max: number;
  limit: number;
  offset: number;
  searchKey: string;
}
