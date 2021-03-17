import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {modelData} from '../app/stickman/data'
import {modelArray} from '../app/stickman/dataArray'




@Injectable({
  providedIn: 'root'
})
export class ClientServService {

  

  constructor( private http: HttpClient) {
    
   }

   getData( x:string, y:string)  {
    // // let headers = new Headers();
    // // //headers.append('Content-Type', 'application/json');
    // // //headers.append('projectid', this.id);
    // // let params = new HttpParams().set("currentExercise","aaa").set("paramName2", "sss"); //Create new HttpParams


    // const headers = new HttpHeaders().append('Content-Type', 'application/json');
    // const params = new HttpParams().append('currentExercise', 'aaaaa');
    return this.http.get('http://192.168.0.12:5000/sensorsdata/Squat');  
   }
}


