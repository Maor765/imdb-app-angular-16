import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OmdbMovie } from '../interfaces/omdb.movie.interface';
import { ImdbRequest } from '../interfaces/imdb-request.interface';
import { ImdbItem } from '../interfaces/imdb-item.interface';
import { Observable, map } from 'rxjs';
import { ImdbResponse } from '../interfaces/imdb-response.interface';
// import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ImdbApiService {
  private backApi = 'https://imdb-app-nodejs.onrender.com/'; 
  // private backApi = 'http://localhost:3000/';

  constructor(protected http: HttpClient) {}

  // test() {
  //   return this.http
  //     .get(`https://jsonplaceholder.typicode.com/users`)
  //     .pipe(map((res: any[]) => res.filter(r => r.name.startsWith('C')).map(r => ({name: r.name, phone: r.phone,id: r.id}))))
  // }

  // test2(id) {
  //   return this.http
  //     .get(`https://jsonplaceholder.typicode.com/posts?id=${id}`)
  // }

  getHeaders() {
    let headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');
    return headers;
  }

  get():Observable<ImdbResponse[]> {
    let url = this.getImdbApi();
    return this.http
      .get<ImdbResponse[]>(url, {
        headers: this.getHeaders(),
      })
      .pipe(map((res:any) => res.data));
  }

  create(body: ImdbRequest): Observable<ImdbItem> {
    let url = this.getImdbApi();
    return this.http
      .post<ImdbItem>(url, body, {
        headers: this.getHeaders(),
      })
      .pipe(map((res:any) => res.data));
  }

  createAll(body:ImdbRequest[]): Observable<ImdbItem[]> {
    let url = this.getImdbApi(true);
    return this.http
      .post<ImdbItem[]>(url, body, {
        headers: this.getHeaders(),
      })
      .pipe(map((res:any) => res.data));
  }

  delete(id) {
    let url = this.getImdbApi();
    return this.http
      .delete(`${url}/${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(map((res:any) => res.data));
  }

  deleteMany(searchType: string) {
    let url = this.getImdbApi(true);
    return this.http
      .delete(`${url}/${searchType}`, {
        headers: this.getHeaders(),
      })
      .pipe(map((res:any) => res.data));
  }

  getByID(id) {
    let url = this.getImdbApi();
    return this.http
      .get(`${url}/${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(map((res:any) => res.data));
  }

  getImdbApi(isList?: boolean) {
    return `${this.backApi}${isList ? 'imdbs' : 'imdb'}`;
  }
}
