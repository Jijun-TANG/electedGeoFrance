import { Injectable } from '@angular/core';

import {BehaviorSubject, catchError, Observable, of} from 'rxjs';

import { AdminUnit, EluInfo, EluNode } from './departs/departs.component';

import { HttpClient } from '@angular/common/http';

import { API_URL } from './env';

import { AdminBasic } from './search-region/search-region.component';

/*
An injectable service in charge of loading data from http side
 */


@Injectable({
  providedIn: 'root'
})
export class CachedDatabaseService {

  //Contains key-value pair like terr-code: [terr-name, [list of elected]]
  terrEluData_ = new BehaviorSubject<{ [key: string]: any }>([]);
  
  territoryData_ = new BehaviorSubject<AdminUnit[]>([]);

  //Contains all the informations of the elected
  eluData_ = new BehaviorSubject<EluInfo[]>([]);

  get territoryData():AdminUnit[] {return this.territoryData_.value;}

  get eluData():EluInfo[] {return this.eluData_.value;}

  //function to load Tree Data from json file to save an array of object locally
  buildTerrDataFileTree(obj :{id: number; name: string; kind: string; code: string; children: any}[], level: number): AdminUnit[] {
    let ans:AdminUnit[] = [];
    for(let i = 0; i<obj.length; ++i){
      const node = new AdminUnit();
      node.id = obj[i].id;
      node.name = obj[i].name;
      node.kind = obj[i].kind;
      node.code = obj[i].code;
      const child_val = obj[i].children;
      if(child_val!=null){
        if(typeof child_val=== "object"){
          node.children = this.buildTerrDataFileTree(child_val, level+1);
        }
      }
      ans.push(node);
    }

    return ans;
  }

  //function to add AdminUnit in TreeView
  insertItem(parent: AdminUnit, obj :{id: number; name: string; kind: string; code: string; children: any}) {
    if (parent.children) {
      parent.children.push(obj as AdminUnit);
      this.territoryData_.next(this.territoryData);
    }
  }

  //function to modify tree unit
  updateItem(node: AdminUnit, id: number | null | undefined, name: string | null | undefined, kind: string | null | undefined, code: string | null | undefined, children: any) {
    if(id!==null && id!==undefined){
      node.id = id
    }
    if(name!==null && name!==undefined){
      node.name = name
    }
    if(kind!==null && kind!==undefined){
      node.kind = kind
    }
    if(code!==null && code!==undefined){
      node.code = code
    }
    if(children!==null && children!==undefined){
      node.children = children
    }
    this.territoryData_.next(this.territoryData);
  }

  //function to remove AdminUnit in tree view
  removeItem(parent:AdminUnit|undefined, id:number){
    if(parent && parent.children && parent.children.length>0){
      parent.children.forEach((element,index)=>{
        if(element.id==id) parent.children.splice(index,1);
     });
    }
    this.territoryData_.next(this.territoryData);
  }

  initialize(){

    this.httpClient.get<{ [key: string]: any }>('assets/elu_terr.json').subscribe(
      (data) => {
        this.terrEluData_.next(data)
      }
    )
    
    this.httpClient.get<{id: number; name: string; kind: string; code: string; children: any}[]>('assets/data.json').subscribe(
      (donnee) => {
        this.territoryData_.next(donnee);
      }
    );

    this.httpClient.get<EluInfo[]>('assets/elu.json').subscribe(
      (donnee) => {
        this.eluData_.next(donnee);
      }
    );
    
    
  }

  constructor(private httpClient: HttpClient) {
    this.initialize();
  }

  
  getElectedByCode(code: string): Observable<EluNode[]>{
    const target_url = `${API_URL}`+'/elected/'+`${code}`;
    return this.httpClient.get<EluNode[]>(target_url);
  }

  getElected(code: string): EluNode[]{
    const endPoint = API_URL + '/elected/' + code
    var EluNodes: EluNode[] = []
    this.httpClient.get<EluNode[]>(endPoint).subscribe({
        next: data => {EluNodes.concat(data); console.log("what's the data?" ,data)},
        error: console.error
      })
    return EluNodes;
  }

  getAdminUnitByName(name: string): Observable<AdminBasic[]>{
    if(name === undefined || name === null || name.length<1){
      return of([]);
    }
    var endPoint = API_URL + '/territoires/' + name
    if(Number.isNaN(Number(name))===false){
      //console.log("we get number! ", Number(name));
      endPoint = API_URL + '/territoires_codes/' + name
    }
    return this.httpClient.get<AdminBasic[]>(endPoint);
  }
}