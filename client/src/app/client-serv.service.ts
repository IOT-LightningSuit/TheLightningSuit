import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, pipe } from 'rxjs';
import { IData } from '../app/stickman/serverData';
import { map } from 'rxjs/operators';




@Injectable({
  providedIn: 'root'
})
export class ClientServService {

  

  constructor( private http: HttpClient) {
    
   }

   getData()  {

    return this.http.get<any>('http://10.0.0.28:5000/sensorsdata/sharon/-1');



   }
  }





