import { Component, OnInit } from '@angular/core';
import {IUser} from '../personal-info/user';

@Component({
  selector: 'app-workout-summary',
  templateUrl: './workout-summary.component.html',
  styleUrls: ['./workout-summary.component.css']
})
export class WorkoutSummaryComponent implements OnInit {

  
  user2 : IUser;
  userAverage :any;
  grade : number;

  constructor() { }
  
  ngOnInit(): void {
    this.userAverage = JSON.parse(localStorage.getItem("userAverage"));
    this.user2 = JSON.parse(localStorage.getItem("userParam"));
    this.grade = JSON.parse(localStorage.getItem("userGrade"));

  }

}
