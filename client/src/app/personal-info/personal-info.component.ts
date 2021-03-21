import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from './user';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {ClientServService} from '../client-serv.service';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';




@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.css']
})
export class PersonalInfoComponent implements OnInit {
  @Input() workoutMode: number;
  @Output() cancelRegister = new EventEmitter();
  model: any = {};
  user : IUser = {name:"aa", exercise:1, workout:1 };
  username: string;





  constructor(private router: Router,private http: HttpClient, service: ClientServService) {


   }
 


  ngOnInit(): void {
    
  }

  register() {
    
  }

  initializeUser(exercise:number) {
    var grade : number;
    localStorage.removeItem("userAverage");
      this.user.name= this.username; // I WANT TO USE USE IN STICKMAN.TS!
      this.user.exercise= exercise;
      this.user.workout= this.workoutMode;
      debugger;
      this.http.get('http://192.168.0.97:5000/sensorsdata/' + this.user.name  + '/101').subscribe((res:number) => {
   },
   err=> console.log("error: "+ err),
   ()=>console.log("complete")
   );
  }

  btnClick=function( exercise : number){
     //the name of the local storage var
     this.initializeUser(exercise);
     localStorage.setItem('userParam', JSON.stringify(this.user));
    //  var tt = JSON.parse(localStorage.getItem("userAverage"));
    this.router.navigateByUrl('/stickman').then(() => { //<------------- STICKMAN.TS
      window.location.reload();
    });
  
  }
  cancel() {
    this.cancelRegister.emit(false);
  }

}
