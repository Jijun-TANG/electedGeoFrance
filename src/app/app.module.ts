import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {MaterialExampleModule} from '../material.module';
import {TreeChecklistExample} from './tree-checklist-example/tree-checklist-example';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatNativeDateModule} from '@angular/material/core';
import {HttpClientModule} from '@angular/common/http';
import { DepartsComponent } from './departs/departs.component';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [TreeChecklistExample, DepartsComponent, AppComponent],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MatNativeDateModule,
    MaterialExampleModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      //{path:'', component: RootComponent},
        {path: 'trees', component: TreeChecklistExample},
        {path: '', component: DepartsComponent},
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
