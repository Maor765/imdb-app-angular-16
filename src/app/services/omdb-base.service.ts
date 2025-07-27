import * as moment from 'moment';
import { BehaviorSubject, firstValueFrom, take } from 'rxjs';
import { OmdbMovie } from '../interfaces/omdb.movie.interface';
import { OmdbApiService } from './omdb-api.service';
import { FileSystemFileEntry } from 'ngx-file-drop';
import { HttpClient } from '@angular/common/http';
import { ImdbApiService } from './imdb-api.service';
import { ImdbItem } from '../interfaces/imdb-item.interface';
import { ImdbRequest } from '../interfaces/imdb-request.interface';

export abstract class OmdbBaseService {
  allGenres: { value: string }[] = [];
  data$ = new BehaviorSubject<Array<ImdbItem>>(null);

  constructor(
    protected http: HttpClient,
    protected omdbApiService: OmdbApiService,
    private searchType: string,
    protected imdbApiService: ImdbApiService
  ) {
    this.imdbApiService
      .get()
      .pipe(take(1))
      .subscribe((res) => {
        const data = res.filter((r) => r.Type === searchType);
        this.data$.next(data);
        this.getAllGenres();
      });
  }

  abstract getNameFromFile(fileName: string);

  getAllGenres() {
    const allGenresMap: Map<string, any> = new Map();
    this.data$.value.forEach((d) => {
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

  extractNames(fileEntrys: FileSystemFileEntry[]) {
    const nameMap: Map<string, any> = new Map();

    fileEntrys.forEach((fileEntry) => {
      const movie = this.getNameFromFile(fileEntry.name);
      if (movie && !nameMap.has(movie)) {
        nameMap.set(movie, true);
      }
    });

    return nameMap;
  }

  getAllNeededProps(item: OmdbMovie) {
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
    return {
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
    };
  }

  getData(fileEntry: FileSystemFileEntry[]) {
    let apiCallCount = 0;
    const data = [];
    const nameMap = this.extractNames(fileEntry);
    nameMap.forEach((value, key) => {
      this.search(key).then((res: OmdbMovie) => {
        apiCallCount++;
        if (res.Response === 'True') {
          data.push({
            ...this.getAllNeededProps(res),
            genreList: res.Genre.split(',').map((elm) => elm.replace(' ', '')),
            runtimeMins: Number(res.Runtime.replace('min', '')),
            releaseDate: moment(res.Released).format('YYYY-MM-DD'),
          });
        } else {
          console.log('issue with api, no results: ', key, res);
        }
        if (apiCallCount === nameMap.size) {
          if (!data.length) {
            this.data$.next(this.data$.value);
            return;
          }
          this.getAllGenres();
          this.saveData(data);
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

  saveData(data: Array<ImdbRequest>) {
    this.imdbApiService
      .createAll(data)
      .pipe(take(1))
      .subscribe((res) => {
        const data: ImdbItem[] = this.data$.value || [];
        data.push(...res);
        this.data$.next(data);
      });
  }

  delete(id: string) {
    this.imdbApiService
      .delete(id)
      .pipe(take(1))
      .subscribe((res) => {
        let data = this.data$.value;
        data = data.filter((d) => d._id !== id);
        this.data$.next(data);
      });
  }

  clearData() {
    this.imdbApiService
      .deleteMany(this.searchType)
      .pipe(take(1))
      .subscribe((res) => {
        this.data$.next([]);
      });
  }
}
