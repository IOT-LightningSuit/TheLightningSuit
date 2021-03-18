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

   getData( x:string, y:string)  {
    // // let headers = new Headers();
    // // //headers.append('Content-Type', 'application/json');
    // // //headers.append('projectid', this.id);
    // // let params = new HttpParams().set("currentExercise","aaa").set("paramName2", "sss"); //Create new HttpParams


    // const headers = new HttpHeaders().append('Content-Type', 'application/json');
    // const params = new HttpParams().append('currentExercise', 'aaaaa');
    return setInterval( () => {
      this.http.get<IData[]>('http://localhost:5000/sensorsdata/Squat').subscribe ( (response:any) => {
    console.log(response[0]);
    
  })},100);

     
   }
  }




// login(model: any) {
//   return this.http.post(this.baseUrl + 'account/login', model).pipe(
//     map((response: User) => {
//       const user = response;
//       if(user) {
//         localStorage.setItem('user', JSON.stringify(user));
//         this.currentUserSource.next(user);
//       }
//     })

//   )
// }
