import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';




@Injectable({
  providedIn: 'root'
})
export class ClientServService {

  

  constructor( private http: HttpClient) {
    
   }

   getData()  {

     return this.http.post<any>('https://jsonplaceholder.typicode.com/posts',  { title: 'Angular POST Request Example' });
   }
}
