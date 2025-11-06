import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Region, Country, State, City, Category, SubCategory, NewsType } from '../models/news.models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Get auth headers with IdToken
  private getAuthHeaders(): HttpHeaders {
    const idToken = localStorage.getItem('idToken');
    
    return new HttpHeaders({
      'Authorization': `Bearer ${idToken}`,
      'Content-Type': 'application/json'
    });
  }

  // ============ REGIONS ============
  getRegions(): Observable<Region[]> {
    return this.http.get<Region[]>(
      `${this.apiUrl}/regions`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      map(data => Array.isArray(data) ? data : []),
      catchError(error => {
        console.error('Error fetching regions:', error);
        return of([]);
      })
    );
  }

  // ============ COUNTRIES ============
  getCountriesByRegion(regionId: number): Observable<Country[]> {
    return this.http.get<Country[]>(
      `${this.apiUrl}/countries?regionId=${regionId}`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      map(data => Array.isArray(data) ? data : []),
      catchError(error => {
        console.error('Error fetching countries:', error);
        return of([]);
      })
    );
  }

  // ============ STATES ============
  getStatesByCountry(countryId: number): Observable<State[]> {
    return this.http.get<State[]>(
      `${this.apiUrl}/states?countryId=${countryId}`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      map(data => Array.isArray(data) ? data : []),
      catchError(error => {
        console.error('Error fetching states:', error);
        return of([]);
      })
    );
  }

  // ============ CITIES ============
  getCitiesByState(stateId: number): Observable<City[]> {
    return this.http.get<City[]>(
      `${this.apiUrl}/cities?stateId=${stateId}`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      map(data => Array.isArray(data) ? data : []),
      catchError(error => {
        console.error('Error fetching cities:', error);
        return of([]);
      })
    );
  }

  // ============ CATEGORIES ============
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(
      `${this.apiUrl}/categories`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      map(data => Array.isArray(data) ? data : []),
      catchError(error => {
        console.error('Error fetching categories:', error);
        return of([]);
      })
    );
  }

  // ============ SUBCATEGORIES ============
  getSubCategories(categoryId: number): Observable<SubCategory[]> {
    return this.http.get<SubCategory[]>(
      `${this.apiUrl}/subcategories?categoryId=${categoryId}`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      map(data => Array.isArray(data) ? data : []),
      catchError(error => {
        console.error('Error fetching subcategories:', error);
        return of([]);
      })
    );
  }

  // ============ NEWS TYPES ============
  getNewsTypes(): Observable<NewsType[]> {
    return this.http.get<NewsType[]>(
      `${this.apiUrl}/newstypes`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      map(data => Array.isArray(data) ? data : []),
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
