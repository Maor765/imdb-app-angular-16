import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { NgxFileDropModule } from 'ngx-file-drop';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MinutesToHours } from './pipes/minuts-to-hours.pipe';
import { ChipsModule } from 'primeng/chips';
import { ImdbContainerComponent } from './componenets/imdb-container/imdb-container.component';
import { TabViewModule } from 'primeng/tabview';
import { ImdbMovieComponent } from './componenets/imdb-movie/imdb-movie.component';
import { ImdbTvComponent } from './componenets/imdb-tv/imdb-tv.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ImdbApiComponent } from './componenets/imdb-api/imdb-api.component';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { AppRoutingModule } from './app-routing.module';
import { VersionComponent } from './componenets/version.component';

@NgModule({
  declarations: [
    AppComponent,
    MinutesToHours,
    ImdbContainerComponent,
    ImdbMovieComponent,
    ImdbTvComponent,
    ImdbApiComponent,
    VersionComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    NgxFileDropModule,
    BrowserAnimationsModule,
    CardModule,
    ButtonModule,
    ProgressSpinnerModule,
    ChipsModule,
    TabViewModule,
    NgxSpinnerModule,
    DropdownModule,
    MultiSelectModule,
    DialogModule,
    InputTextModule,
    ToggleButtonModule,
    AppRoutingModule,
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
