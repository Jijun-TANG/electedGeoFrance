import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import {
   debounceTime, distinctUntilChanged, switchMap
 } from 'rxjs/operators';

 import { CachedDatabaseService } from '../cached-database.service';

export class AdminBasic{ 
  id:number = -1;
  name:string = "";
  kind:string = "";
  code:string = "";
}

@Component({
  selector: 'app-search-region',
  templateUrl: './search-region.component.html',
  styleUrls: ['./search-region.component.css']
})
export class SearchRegionComponent implements OnInit {
  searchString: string | undefined;
  heroes$!: Observable<AdminBasic[]>;
  private searchTerms = new Subject<string>();

  constructor(private dataService: CachedDatabaseService) { }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(
      debounceTime(350),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.dataService.getAdminUnitByName(term)),
    );
    this.heroes$.subscribe(data => console.log(data));
  }

}