import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {MaterialExampleModule} from '../material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatNativeDateModule} from '@angular/material/core';
import {HttpClientModule} from '@angular/common/http';
import { DepartsComponent } from './departs/departs.component';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ElectedComponent } from './elected/elected.component';
import { SearchRegionComponent } from './search-region/search-region.component';

@NgModule({
  declarations: [ DepartsComponent, AppComponent, ElectedComponent, SearchRegionComponent],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MatNativeDateModule,
    MaterialExampleModule,
    ReactiveFormsModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

/*
RouterModule.forRoot([
      //{path:'', component: RootComponent},
        {path: '', component: DepartsComponent},
    ]),
*/