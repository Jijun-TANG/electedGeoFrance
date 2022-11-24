import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoadDataService {
  constructor(private http: HttpClient) {
    //this.items: Product[] = [];
  }
  
  /*
  addToCart(item: AdminUnit) {
    //console.log('product parameters: ', product);
    this.items.push(item);
    //console.log("what's in our carts? ", this.items);
  }
  
  */
 
  getData(){
    return this.http.get<{id: number; name: string; kind: string; code: string; children: any}[]>('assets/data.json');
  }
}
