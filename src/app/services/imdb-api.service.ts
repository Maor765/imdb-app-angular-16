import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ImdbRequest } from '../interfaces/imdb-request.interface';
import { ImdbItem } from '../interfaces/imdb-item.interface';
import { Observable, map } from 'rxjs';
import { ImdbResponse } from '../interfaces/imdb-response.interface';

@Injectable({
  providedIn: 'root',
})
export class ImdbApiService {
  // private backApi = 'https://imdb-app-nodejs.onrender.com/';
  private backApi = 'https://imdb-app-nodejs.vercel.app/';

  // private backApi = 'http://localhost:3000/';

  constructor(protected http: HttpClient) {}

  getHeaders() {
    let headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');
    return headers;
  }

  get(): Observable<ImdbResponse[]> {
    let url = this.getImdbApi();
    return this.http
      .get<ImdbResponse[]>(url, {
        headers: this.getHeaders(),
      })
      .pipe(map((res: any) => res.data));
  }

  create(body: ImdbRequest): Observable<ImdbItem> {
    let url = this.getImdbApi();
    return this.http
      .post<ImdbItem>(url, body, {
        headers: this.getHeaders(),
      })
      .pipe(map((res: any) => res.data));
  }

  createAll(body: ImdbRequest[]): Observable<ImdbItem[]> {
    let url = this.getImdbApi(true);
    return this.http
      .post<ImdbItem[]>(url, body, {
        headers: this.getHeaders(),
      })
      .pipe(map((res: any) => res.data));
  }

  delete(id) {
    let url = this.getImdbApi();
    return this.http
      .delete(`${url}/${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(map((res: any) => res.data));
  }

  deleteMany(searchType: string) {
    let url = this.getImdbApi(true);
    return this.http
      .delete(`${url}/${searchType}`, {
        headers: this.getHeaders(),
      })
      .pipe(map((res: any) => res.data));
  }

  getByID(id) {
    let url = this.getImdbApi();
    return this.http
      .get(`${url}/${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(map((res: any) => res.data));
  }

  getImdbApi(isList?: boolean) {
    return `${this.backApi}${isList ? 'imdbs' : 'imdb'}`;
  }
}
