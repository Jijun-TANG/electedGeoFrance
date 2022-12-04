import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DepartsComponent } from './departs/departs.component';
import { ElectedComponent } from './elected/elected.component';

const routes: Routes = [
  {path: '', component: DepartsComponent},
  {path: 'adminCode/:code', component: ElectedComponent}
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
