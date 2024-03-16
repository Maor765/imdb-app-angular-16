import * as moment from 'moment';
import { BehaviorSubject, Subject, filter, firstValueFrom, tap } from 'rxjs';
import { OmdbMovie } from '../interfaces/omdb.movie.interface';
import { OmdbApiService } from './omdb-api.service';
import { FileSystemFileEntry } from 'ngx-file-drop';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ImdbApiService } from './imdb-api.service';
import { ImdbItem } from '../interfaces/imdb-item.interface';

export abstract class OmdbBaseService {
  data: Array<ImdbItem>;
  allGenres: { value: string }[] = [];
  nameMap: Map<string, any> = new Map();
  fetchingDataStatus = new Subject<boolean>();
  data$ = new BehaviorSubject<Array<ImdbItem>>(null);

  constructor(
    protected http: HttpClient,
    protected omdbApiService: OmdbApiService,
    private searchType: string,
    private localStorageKey: string,
    protected imdbApiService: ImdbApiService,
  ) {
    if (localStorage.getItem(this.localStorageKey)) {
      this.data = [];
      this.data = JSON.parse(localStorage.getItem(this.localStorageKey));
      this.getAllGenres();
    }
    this.imdbApiService.get().subscribe(res => {
      this.data = res.filter( r=> r.Type === searchType);
      this.data$.next(this.data);
      this.getAllGenres();
    })
  }

  abstract getNameFromFile(fileName: string);

  getAllGenres() {
    const allGenresMap: Map<string, any> = new Map();
    this.data.forEach((d) => {
      d.genreList?.forEach((genre) => {
        if (!allGenresMap.has(genre)) {
          allGenresMap.set(genre, true);
        }
      });
    });
    this.allGenres = Array.from(allGenresMap.keys()).map((elm) => ({
      value: elm,
    }));
  }

  extractNames(fileEntry: FileSystemFileEntry) {
    const movie = this.getNameFromFile(fileEntry.name);
    if (movie && !this.nameMap.has(movie)) {
      this.nameMap.set(movie, true);
    }
  }

  getData() {
    let apiCallCount = 0;
    this.data = [];
    this.nameMap.forEach((value, key) => {
      this.search(key).then((res: OmdbMovie) => {
        apiCallCount++;
        if (res.Response === 'True') {
          this.data.push({
            ...res,
            genreList: res.Genre.split(',').map((elm) => elm.replace(' ', '')),
            runtimeMins: Number(res.Runtime.replace('min', '')),
            releaseDate: moment(res.Released).format('YYYY-MM-DD'),
          });
        } else {
          console.log('issue with tv, no results: ', key, res);
        }
        if (apiCallCount === this.nameMap.size) {
          this.getAllGenres();
          this.saveData();
          this.fetchingDataStatus.next(true);
        }
      });
    });
  }

  getOmdbUrl(name: string) {
    let url = this.omdbApiService.getOmdbMainUrl();
    return `${url}&type=${this.searchType}&t=${name}`;
  }

  search(tvName: string) {
    return firstValueFrom(this.http.get(this.getOmdbUrl(tvName)));
  }

  saveData() {
    this.imdbApiService.createAll(this.data);
    // localStorage.setItem(this.localStorageKey, JSON.stringify(this.data));
  }

  clearData() {
    this.data = [];
    localStorage.removeItem(this.localStorageKey);
  }
}
