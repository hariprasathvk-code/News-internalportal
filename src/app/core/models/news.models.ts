export interface Region {
  id: number;
  name: string;
}

export interface Country {
  id: number;
  name: string;
  regionId: number;
}

export interface State {
  id: number;
  name: string;
  countryId: number;
}

export interface City {
  id: number;
  name: string;
  stateId: number;
}

export interface Category {
  id: number;
  name: string;
}

export interface SubCategory {
  id: number;
  name: string;
  categoryId: number;
}

export interface NewsType {
  id: number;
  name: string;
}

export interface MediaFile {
  fileName: string;
  base64Content: string;
}

export interface NewsSubmission {
  title: string;
  summary: string;
  content: string;
  category: string;
  subCategory: string;
  region: string;
  country: string;
  state: string;
  city: string;
  newsType: string;
  authorFullName: string;
  mediaFiles: MediaFile[];
}

export interface NewsResponse {
  success: boolean;
  message: string;
  newsId: string;
  mediaFolder: string;
  mediaCount: number;
  news: any;
}
