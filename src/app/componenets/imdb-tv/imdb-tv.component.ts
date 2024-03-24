import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  NgxFileDropEntry,
  FileSystemFileEntry,
} from 'ngx-file-drop';
import { takeUntil } from 'rxjs/operators';
import { FilterUtilService, ISortField } from 'src/app/services/filter-util.service';
import { TvsIMDBService } from 'src/app/services/tvs-imdb.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ImdbItem } from 'src/app/interfaces/imdb-item.interface';
import { ImdbApiService } from 'src/app/services/imdb-api.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-imdb-tv',
  templateUrl: './imdb-tv.component.html',
  styleUrls: ['./imdb-tv.component.scss']
})
export class ImdbTvComponent implements OnInit, OnDestroy {

  selectedSort: ISortField;
  selectedGenre;
  isAsc:boolean  = false;
  filterData;

  data: Array<ImdbItem> = [];
  viewData: Array<ImdbItem> = [];
  destroyed = new Subject();
  constructor(public tvsService: TvsIMDBService,
    public spinner: NgxSpinnerService,
    public imdbApiService: ImdbApiService,
    public filterUtilService:FilterUtilService) {}

    //takeuntil this
  ngOnInit() {
    this.tvsService.data$.pipe(takeUntil(this.destroyed)).subscribe(res => {
      this.data = this.viewData = res;
      this.spinner.hide();
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

    this.tvsService.getData(fileEntrys);
  }


  goToLink(imdb_id: string) {
    window.open(`https://www.imdb.com/title/${imdb_id}`, '_blank');
  }

  clearData(){
    this.tvsService.clearData();
  }

  getGenres(tv) {
    return tv.Genre.split(',');
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
    this.tvsService.delete(id);
  }
}
