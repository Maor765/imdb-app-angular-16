import { Component, OnInit, OnDestroy } from '@angular/core';
import { ImdbApiService } from './services/imdb-api.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  destroyed = new Subject();
  constructor(public imdbApiService: ImdbApiService) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.destroyed.next(true);
    this.destroyed.complete();
  }
}
