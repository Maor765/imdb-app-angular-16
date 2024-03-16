import { Component, OnInit } from '@angular/core';
import { OmdbApiService } from 'src/app/services/omdb-api.service';

@Component({
  selector: 'app-imdb-api',
  templateUrl: './imdb-api.component.html',
  styleUrls: ['./imdb-api.component.scss']
})
export class ImdbApiComponent implements OnInit {

  apiKey = "";
  display: boolean = false;

  constructor(private imdbApiService:OmdbApiService) { }

  ngOnInit(): void {
  }

  updateApiKey(){
    this.imdbApiService.setApiKey(this.apiKey);
  }


}
