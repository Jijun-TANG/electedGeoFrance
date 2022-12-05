import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { CachedDatabaseService } from '../cached-database.service';
import { EluNode } from '../departs/departs.component';

@Component({
  selector: 'app-elected',
  templateUrl: './elected.component.html',
  styleUrls: ['./elected.component.css']
})
export class ElectedComponent implements OnInit {
  electedInfo:EluNode[] | undefined; 
  constructor(
    private route:ActivatedRoute,
    private dataService:CachedDatabaseService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.getHero();
  }

  getHero(): void {
    const id = this.route.snapshot.paramMap.get('code')!;
    //console.log("params dict ", this.route.snapshot.paramMap);
    this.dataService.getElectedByCode(id).subscribe(elects => this.electedInfo = elects);
  }

  goBack(): void {
    this.location.back();
  }

  // save(): void {
  //   if (this.electedInfo) {
  //     this.dataService.updateItem(this.electedInfo)
  //       .subscribe(() => this.goBack());
  //   }
  // }
}
