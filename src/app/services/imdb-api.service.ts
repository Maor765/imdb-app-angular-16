import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OmdbMovie } from '../interfaces/omdb.movie.interface';
import { ImdbRequest } from '../interfaces/imdb-request.interface';
import { ImdbItem } from '../interfaces/imdb-item.interface';
import { Observable, map } from 'rxjs';
import { ImdbResponse } from '../interfaces/imdb-response.interface';

@Injectable({
  providedIn: 'root',
})
export class ImdbApiService {
  private backApi = 'https://imdb-app-nodejs.onrender.com/';

  constructor(protected http: HttpClient) {}

  getHeaders() {
    let headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');
    return headers;
  }

  transformToImdbRequest(item: ImdbItem): ImdbRequest {
    const {
      Title,
      Year,
      Released,
      Runtime,
      Genre,
      Plot,
      Poster,
      imdbRating,
      imdbID,
      Type,
    } = item;
    return { Title,
      Year,
      Released,
      Runtime,
      Genre,
      Plot,
      Poster,
      imdbRating,
      imdbID,
      Type,};
  }
  

  get():Observable<ImdbResponse[]> {
    let url = this.getImdbApi();
    return this.http
      .get<ImdbResponse[]>(url, {
        headers: this.getHeaders(),
      })
      .pipe();
  }

  create(body: ImdbItem) {
    const req = this.transformToImdbRequest(body);
    let url = this.getImdbApi();
    return this.http
      .post(url, req, {
        headers: this.getHeaders(),
      })
      .pipe();
  }

  createAll(body:ImdbItem[]) {
    const req = body.map(b => this.transformToImdbRequest(b));
    let url = this.getImdbApi(true);
    return this.http
      .post(url, req, {
        headers: this.getHeaders(),
      })
      .pipe();
  }

  delete(id) {
    let url = this.getImdbApi();
    return this.http
      .delete(url, {
        headers: this.getHeaders(),
      })
      .pipe();
  }

  getImdbApi(isList?: boolean) {
    return `${this.backApi}${isList ? 'imdbs' : 'imdb'}`;
  }
}
