import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  NgxFileDropEntry,
  FileSystemFileEntry,
} from 'ngx-file-drop';
import { MoviesIMDBService } from './../../services/movies-imdb.service';
import { FilterUtilService, ISortField } from 'src/app/services/filter-util.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { take, takeUntil } from 'rxjs/operators';
import { ImdbItem } from 'src/app/interfaces/imdb-item.interface';
import { ImdbApiService } from 'src/app/services/imdb-api.service';
import { Subject, firstValueFrom } from 'rxjs';

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
  viewData: Array<ImdbItem> = [];
  destroyed = new Subject();

  constructor(
    public moviesService: MoviesIMDBService,
    public spinner: NgxSpinnerService,
    public imdbApiService: ImdbApiService,
    public filterUtilService:FilterUtilService) {}

  ngOnInit() {
    this.moviesService.data$.pipe(takeUntil(this.destroyed)).subscribe(res => {
      this.spinner.hide();
      this.data = this.viewData = res;
    })
  }

  ngOnDestroy(){
    this.destroyed.next(true);
    this.destroyed.complete();
  }

  public files: NgxFileDropEntry[] = [];

  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    this.spinner.show();
    const fileEntrys = [];
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntrys.push(fileEntry);
      }
    }
    this.moviesService.getData(fileEntrys);
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
      this.viewData = this.data;
    } else {
      this.viewData = this.filterUtilService.sortBy(this.selectedSort, this.data);
      if(this.isAsc){
        this.viewData  = this.viewData.reverse();
      }
    }
  }

  ascDescChange($event){
    this.viewData = this.viewData.reverse();
  }

  onChangeFilterInput($event){
    this.viewData= this.data.filter((movie) => {
      return movie.Title.toLocaleLowerCase().includes($event.toLocaleLowerCase());
    });
  }

  onChangeGenre(){
    if(this.selectedGenre){
      this.viewData = this.filterUtilService.getAllGenres(this.selectedGenre, this.data);
    } else {
      this.viewData = this.data;
    }
  }

  async remove(id: string) {
    this.moviesService.delete(id);
  }
}
