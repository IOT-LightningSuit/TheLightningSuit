import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })};

const headerDict = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Access-Control-Allow-Headers': 'Content-Type',
}

const requestOptions = {                                                                                                                                                                                 
  headers: new Headers(headerDict), 
};

@Injectable({
  providedIn: 'root'
})
export class ClientServService {

  

  constructor( private http: HttpClient) {
    
   }

   getData() : Observable<string> {

     return this.http.get<string>('https://putsreq.com/poBOHZTcRvVyZBPO6rdV', httpOptions);
   }
}
