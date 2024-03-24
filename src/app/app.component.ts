import { Component, OnInit, OnDestroy } from '@angular/core';
import { ImdbApiService } from './services/imdb-api.service';
import { Subject, mergeMap, of, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {

  destroyed = new Subject();
  constructor(public imdbApiService: ImdbApiService) {}

  ngOnInit() {
    // this.imdbApiService
    //   .test()
    //   .pipe(takeUntil(this.destroyed))
    //   .subscribe((res) => {


    //     console.log(res);

    //     of(...res.map((r) => r.id)) //outer observable
    //       .pipe(
    //         mergeMap((id) => {
    //           return this.imdbApiService.test2(id); //inner observable
    //         })
    //       )
    //       .subscribe((data) => {
    //         console.log(data);
    //       });


    //   });
  }

  ngOnDestroy() {
    this.destroyed.next(true);
    this.destroyed.complete();
  }
}
