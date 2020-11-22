import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-workouts',
  templateUrl: './workouts.component.html',
  styleUrls: ['./workouts.component.css']
})
export class WorkoutsComponent implements OnInit {
  registerMode = false;
  workoutMode: number;

  constructor() { }

  ngOnInit(): void {
  }

  registerToggle(workoutNum: number) {
    this.registerMode = true;
    this.workoutMode = workoutNum;
  }

  cancelRegisterMode(event: boolean) {
    this.registerMode = event;
  }

}
