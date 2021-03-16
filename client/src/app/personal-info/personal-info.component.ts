import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';



@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.css']
})
export class PersonalInfoComponent implements OnInit {
  @Input() workoutMode: number;
  @Output() cancelRegister = new EventEmitter();
  model: any = {}


  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  register() {

  }

  btnClick=function(){
    this.router.navigateByUrl('/stickman').then(() => {
      window.location.reload();
    });
  
  }
  cancel() {
    this.cancelRegister.emit(false);
  }

}
