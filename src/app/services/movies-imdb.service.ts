import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isNumeric } from '../helpers/helpers.utils';
import { ImdbApiService } from './imdb-api.service';
import { OmdbBaseService } from './omdb-base.service';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MoviesIMDBService extends OmdbBaseService {
  constructor(
    protected override http: HttpClient,
    protected override imdbApiService: ImdbApiService
  ) {
    super(http, imdbApiService, 'movie', 'movie-data2');
    this.testApi().subscribe();
  }

  testApi() {
    let headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');
    return this.http
      .get('https://nodejs-express-monogo-typescript.onrender.com/employee', {
        headers,
      })
      .pipe(
        tap((res) => {
          console.log('employees:', res);
        })
      );
  }

  getNameFromFile(fileName: string) {
    if (fileName.endsWith('.mkv') || fileName.endsWith('.mp4')) {
      let splitByDots = fileName.split('.');
      if (splitByDots.length <= 3) {
        splitByDots = fileName.split(' ');
      }
      let name = '';
      let year;
      for (let i = 0; i < splitByDots.length; i++) {
        if (splitByDots[i].length === 4 && isNumeric(splitByDots[i])) {
          year = Number(splitByDots[i]);
          break;
        }
        name = name.length === 0 ? splitByDots[i] : `${name} ${splitByDots[i]}`;
      }

      return name;
    }
    return null;
  }
}
