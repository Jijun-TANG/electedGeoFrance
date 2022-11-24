import { Injectable } from '@angular/core';

import {BehaviorSubject, Observable} from 'rxjs';

import { AdminUnit, AdminUnitFlatNode, positions_of_source, source_of_elu, EluInfo, EluNode } from './departs/departs.component';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CachedDatabaseService {

  territoryData_ = new BehaviorSubject<AdminUnit[]>([]);

  //Contains all the informations of the elected
  eluData_ = new BehaviorSubject<EluInfo[]>([]);

  //Contains key-value pair like terr-code: [terr-name, [list of elected]]
  terrEluData_ = new BehaviorSubject<EluInfo[]>([]);

  get territoryData():AdminUnit[] {return this.territoryData_.value;}

  get eluData():EluInfo[] {return this.eluData_.value;}

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

  insertItem(parent: AdminUnit, obj :{id: number; name: string; kind: string; code: string; children: any}) {
    if (parent.children) {
      parent.children.push(obj as AdminUnit);
      this.territoryData_.next(this.territoryData);
    }
  }

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

  initialize(){
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
}