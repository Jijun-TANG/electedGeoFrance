import { Component, OnInit, Optional } from '@angular/core';

import { Observable, BehaviorSubject } from 'rxjs';
import { LoadDataService } from '../load-data.service';

import { CachedDatabaseService } from '../cached-database.service';

import {SelectionModel} from '@angular/cdk/collections';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';


/* Class definition for Administrative Unit (departement, ecpi, commune, canton, etc.)*/
export class AdminUnit{
  id: number;
  name: string; 
  kind: string; 
  code: string; 
  children: AdminUnit[]
}

export class AdminUnitFlatNode {
  id:number;
  name:string;
  kind:string;
  code: string;
  level: number;
  expandable: boolean;
}

/* Class definition for list of elected */
export interface positions_of_source{
  "end_date" : any;
        "profession" : string;
        "ranking_score" : number;
        "role_uid" : string;
        "start_date" : string;
        "territory_uid" : string;
}

export interface source_of_elu{
  "physical_person_id" : number;
    "firstname" : string;
    "lastname" : string;
    "fullname" : string;
    "departments_uids" : string[];
    "positions" : positions_of_source[];
    "has_current_position" : Boolean;
}

export class EluInfo{
     
  "_type" : string;
  "_id" : string;
  
  "_source" : source_of_elu;
  "sort" : number[];
}

export class EluNode{
  fullName: string;
  positionName: string;
  stillEffective:Boolean;
}


@Component({
  selector: 'app-departs',
  templateUrl: './departs.component.html',
  styleUrls: ['./departs.component.scss']
})


export class DepartsComponent implements OnInit {
  dataChange = new BehaviorSubject<AdminUnit[]>([]);


  get data(): AdminUnit[] {
    return this.dataChange.value;
  }


  /* build two map contains key value pairs separately of departement - elus and AdminUnit - elus */ 
  buildTerrEluDataMap(obj :EluInfo[]): [Map<string, EluNode[]> , Map<string, EluNode[]>]{
    let depEluMap = new Map<string,EluNode[]> ();
    let adminUEluMap = new Map<string,EluNode[]> ();
    obj.forEach(
      (eluInfoNode:EluInfo) => {
        if (eluInfoNode._source.positions.length>0){
          for(var i = 0; i<eluInfoNode._source.positions.length; i++){
            let temp = new EluNode();
            temp.stillEffective = eluInfoNode._source.positions[i].end_date !== null && eluInfoNode._source.positions[i].end_date !== undefined;
            var k1 = eluInfoNode._source.positions[i].territory_uid;
            temp.fullName = eluInfoNode._source.fullname;
            temp.positionName = eluInfoNode._source.positions[i].role_uid;
            if(adminUEluMap.has(k1)){
              const arr1 = adminUEluMap.get(k1);
              adminUEluMap.set(k1, [...(arr1 !== undefined ? arr1 : []), temp]);
            }
            else{
              adminUEluMap.set(k1, [temp]);
            }
            eluInfoNode._source.departments_uids.forEach(
              (dUid:string) => {
                if(depEluMap.has(dUid)){
                  const arr1 = depEluMap.get(k1);
                  depEluMap.set(dUid, [...(arr1 !== undefined ? arr1 : []), temp]);
                }
                else{
                  depEluMap.set(dUid, [temp]);
                }
              }
            )
          }
        }
      }
    )
    return [depEluMap, adminUEluMap];
  }
  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is a list of `AdminUnit`.*/

  buildFileTree(obj :{id: number; name: string; kind: string; code: string; children: any}[], level: number): AdminUnit[] {
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
          node.children = this.buildFileTree(child_val, level+1);
        }
      }
      ans.push(node);
    }
    
    return ans;
  }

  /** Add an item to to-do list */
  insertItem(parent: AdminUnit, id:number, name: string, kind:string, code: string) {
    if (parent.children) {
      parent.children.push({"id":id, "name": name, "kind":kind, "code":code} as AdminUnit);
      this.dataChange.next(this.data);
    }
  }

  updateItem(node: AdminUnit, id?:number, name?: string, kind?:string, code?: string) {
    if(typeof(id)!== 'undefined'){
      node.id = id;
    }
    if(typeof(name)!== 'undefined'){
      node.name = name;
    }
    if(typeof(kind)!== 'undefined'){
      node.kind = kind;
    }
    if(typeof(code)!== 'undefined'){
      node.code = code;
    }
    this.dataChange.next(this.data);
  }

  depEluMap = new Map<string,EluNode[]> ();
  adminUEluMap = new Map<string,EluNode[]> ();

  constructor(private cache: CachedDatabaseService) { }
  
  
  ngOnInit(): void {

    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren,
    );
    this.treeControl = new FlatTreeControl<AdminUnitFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    //An intermediairy cached database may prevent unnecessary change done to the raw data bases
    this.cache.territoryData_.subscribe(
      (data) => {
        this.dataSource.data = data;
        this.treeControl.expand(this.treeControl.dataNodes[0]);
      }
    );

    this.cache.eluData_.subscribe(
      (data) => {
        const temp = this.buildTerrEluDataMap(data);
        this.depEluMap = temp[0];
        this.adminUEluMap = temp[1];
        console.log(data.length)
        console.log(this.depEluMap)
        console.log(this.adminUEluMap)
      }
    );
  }

  flatNodeMap = new Map<AdminUnitFlatNode, AdminUnit>();

  searchString:string = '';
  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<AdminUnit, AdminUnitFlatNode>();

  /** A selected parent node to be inserted */
  selectedParent: AdminUnitFlatNode | null = null;

  /** The new item's name */
  newItemName = '';

  treeControl: FlatTreeControl<AdminUnitFlatNode>;

  treeFlattener: MatTreeFlattener<AdminUnit, AdminUnitFlatNode>;

  dataSource: MatTreeFlatDataSource<AdminUnit, AdminUnitFlatNode>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<AdminUnitFlatNode>(true /* multiple */);

  

  getLevel = (node: AdminUnitFlatNode) => node.level;

  isExpandable = (node: AdminUnitFlatNode) => node.expandable;

  getChildren = (node: AdminUnit): AdminUnit[]|undefined => node.children; 

  hasChild = (_: number, _nodeData: AdminUnitFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: AdminUnitFlatNode) => _nodeData.name === '' && typeof _nodeData.id === "undefined";

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   * 
   * 
   * 
   */
  transformer = (node: AdminUnit, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode.name === node.name ? existingNode : new AdminUnitFlatNode();
    flatNode.id = node.id;
    flatNode.name = node.name;
    flatNode.kind = node.kind;
    flatNode.code = node.code;
    flatNode.level = level;
    flatNode.expandable = !!node.children?.length;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };

  filterLeafNode(node: AdminUnitFlatNode): boolean{
    if(!node || node === undefined){
      return false;
    }

    //this.searchString = this.searchString.trim();
    if(!this.searchString || this.searchString.length<=0){
      return true;//display element
    }
    const digit_string = Number(this.searchString);
    if(!Number.isNaN(digit_string)){
      return node.code.indexOf(this.searchString) !== -1;
    }
    return node.name.toLowerCase().indexOf(this.searchString.toLowerCase()) !== -1;
  }

  filterParentNode(node: AdminUnitFlatNode): boolean {
    if(!node || node === undefined){
      return false;
    }

    //this.searchString = this.searchString.trim();
    if(!this.searchString || this.searchString.length<=0){
      return true;//display element
    }
    const digit_string = Number(this.searchString);
    if(!Number.isNaN(digit_string)){
      return node.code.indexOf(this.searchString) !== -1;
    }
    if (node.name.toLowerCase().indexOf(this.searchString.toLowerCase()) !== -1) {
      return true;
    }
    const descendants = this.treeControl.getDescendants(node)

    if (
      descendants.some(
        (descendantNode) =>
          descendantNode.name
            .toLowerCase()
            .indexOf(this.searchString?.toLowerCase()) !== -1 || descendantNode.code.indexOf(this.searchString) !== -1
      )
    ) {
      return true;
    }

    return false;
  }

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: AdminUnitFlatNode): boolean {
    if(!node || node === undefined){
      return false;
    }
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every(child => {
        return this.checklistSelection.isSelected(child);
      });
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: AdminUnitFlatNode): boolean {
    if(!node || node === undefined){
      return false;
    }
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: AdminUnitFlatNode): void {
    this.checklistSelection.toggle(node);
    if(!node || node === undefined){
      return;
    }
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.forEach(child => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: AdminUnitFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: AdminUnitFlatNode): void {
    let parent: AdminUnitFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: AdminUnitFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    if(!node || node === undefined){
      return;
    }
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every(child => {
        return this.checklistSelection.isSelected(child);
      });
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: AdminUnitFlatNode): AdminUnitFlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }
    if(!this.treeControl.dataNodes){
      return null;
    }
    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  /** Select the category so we can insert the new item. */
  addNewItem(node: AdminUnitFlatNode) {
    const parentNode = this.flatNodeMap.get(node);
    this.cache.insertItem(parentNode!, {id: 0, name: '', kind: '', code: '', children: []});
    this.treeControl.expand(node);
  }
  

  /** Save the node to database */
  saveNode(node: AdminUnitFlatNode, id: number | null | undefined, name: string | null | undefined, kind: string | null | undefined, code: string | null | undefined, children: any) {
    const nestedNode = this.flatNodeMap.get(node);
    this.cache.updateItem(nestedNode!, id, name, kind, code, children);
  }
  
}
