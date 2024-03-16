import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  NgxFileDropEntry,
  FileSystemFileEntry,
} from 'ngx-file-drop';
import { MoviesIMDBService } from './../../services/movies-imdb.service';
import { FilterUtilService, ISortField } from 'src/app/services/filter-util.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { take } from 'rxjs/operators';
import { ImdbItem } from 'src/app/interfaces/imdb-item.interface';
import { ImdbApiService } from 'src/app/services/imdb-api.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-imdb-movie',
  templateUrl: './imdb-movie.component.html',
  styleUrls: ['./imdb-movie.component.scss']
})
export class ImdbMovieComponent implements OnInit, OnDestroy {

  selectedSort: ISortField = null;
  selectedGenre = null;;
  isAsc:boolean  = false;
  filterData = null;;

  data: Array<ImdbItem> = [];

  constructor(
    public moviesService: MoviesIMDBService,
    public spinner: NgxSpinnerService,
    public imdbApiService: ImdbApiService,
    public filterUtilService:FilterUtilService) {}

  ngOnInit() {
    // this.data = this.moviesService.data;
    this.moviesService.data$.subscribe(res => {
      this.data = res;
    })
  }

  ngOnDestroy(){
    // this.moviesService.saveData();
  }

  public files: NgxFileDropEntry[] = [];

  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    this.spinner.show();
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        this.moviesService.extractNames(fileEntry);
      }
    }

    // console.log('////////////////FINISH//////////////');
    // console.log(this.tvsService.tvsNameMap);

    this.moviesService.getData();

    this.moviesService.fetchingDataStatus.pipe(take(1)).subscribe(res => {
      this.data = this.moviesService.data;
      this.spinner.hide();
    })
  }


  goToLink(imdb_id: string) {
    window.open(`https://www.imdb.com/title/${imdb_id}`, '_blank');
  }

  clearData(){
    this.data = [];
    this.moviesService.clearData();
  }

  onChangeSort(){
    if(!this.selectedSort){
      this.data = this.moviesService.data;
    } else {
      this.data = this.filterUtilService.sortBy(this.selectedSort, this.moviesService.data);
      if(this.isAsc){
        this.data  = this.data.reverse();
      }
    }
  }

  ascDescChange($event){
    this.data = this.data.reverse();
  }

  onChangeFilterInput($event){
    this.data = this.moviesService.data;
    this.data= this.moviesService.data.filter((movie) => {
      return movie.Title.toLocaleLowerCase().includes($event.toLocaleLowerCase());
    });
  }

  onChangeGenre(){
    if(this.selectedGenre){
      this.data = this.filterUtilService.getAllGenres(this.selectedGenre, this.moviesService.data);

    } else {
      this.data = this.moviesService.data;
    }
  }

  async remove(id: string) {
    let res = await firstValueFrom(this.imdbApiService.delete(id));
    this.data = this.data.filter(d => d._id !== id); // change to remove by index
  }
}
