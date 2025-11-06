import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Region, Country, State, City, Category, SubCategory, NewsType } from '../models/news.models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Regions
  getRegions(): Observable<Region[]> {
    return this.http.get<Region[]>(`${this.apiUrl}/regions`).pipe(
      catchError(error => {
        console.error('Error fetching regions:', error);
        return of([]);
      })
    );
  }

  // Countries by Region
  getCountriesByRegion(regionId: number): Observable<Country[]> {
    return this.http.get<Country[]>(`${this.apiUrl}/countries?regionId=${regionId}`).pipe(
      catchError(error => {
        console.error('Error fetching countries:', error);
        return of([]);
      })
    );
  }

  // States by Country
  getStatesByCountry(countryId: number): Observable<State[]> {
    return this.http.get<State[]>(`${this.apiUrl}/states?countryId=${countryId}`).pipe(
      catchError(error => {
        console.error('Error fetching states:', error);
        return of([]);
      })
    );
  }

  // Cities by State
  getCitiesByState(stateId: number): Observable<City[]> {
    return this.http.get<City[]>(`${this.apiUrl}/cities?stateId=${stateId}`).pipe(
      catchError(error => {
        console.error('Error fetching cities:', error);
        return of([]);
      })
    );
  }

  // Categories
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`).pipe(
      catchError(error => {
        console.error('Error fetching categories:', error);
        return of([]);
      })
    );
  }

  // SubCategories by Category
  getSubCategories(categoryId: number): Observable<SubCategory[]> {
    return this.http.get<SubCategory[]>(`${this.apiUrl}/subcategories?categoryId=${categoryId}`).pipe(
      catchError(error => {
        console.error('Error fetching subcategories:', error);
        return of([]);
      })
    );
  }

  // News Types
  getNewsTypes(): Observable<NewsType[]> {
    return this.http.get<NewsType[]>(`${this.apiUrl}/newstypes`).pipe(
      catchError(error => {
        console.error('Error fetching news types:', error);
        return of([]);
      })
    );
  }

  // Filter items by search term
  filterItems(items: any[], searchTerm: string, property: string = 'name'): any[] {
    if (!searchTerm) {
      return items;
    }
    return items.filter(item =>
      item[property].toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
}
