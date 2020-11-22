import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.css']
})
export class PersonalInfoComponent implements OnInit {
  @Input() workoutMode: number;
  @Output() cancelRegister = new EventEmitter();
  model: any = {}


  constructor() { }

  ngOnInit(): void {
  }

  register() {

  }

  cancel() {
    this.cancelRegister.emit(false);
  }

}
