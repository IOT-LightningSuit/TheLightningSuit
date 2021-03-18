import { Component, OnInit } from '@angular/core';
import { ClientServService } from '../client-serv.service';
import { IData } from './serverData'
import { map } from 'rxjs/operators'

@Component({
  selector: 'app-stickman',
  templateUrl: './stickman.component.html',
  styleUrls: ['./stickman.component.css']
})
export class StickmanComponent implements OnInit {
  workoutInProgress : boolean;
  // {
//     interface res {
//         lll[] res;
//     }

//  class lll{
//      string ss;
//      _Exercise ex;
//  }

//  Interface _Exercise{
//      public readonly JointLimits[] joints;
//         public Exercise()
//         {
//             joints = new JointLimits[13];
//         }
// }

//     intarface _JointLimits{
//         public float startAngleX;
//         //public float startAngleY;
//         //public float startAngleZ;
//         public float endAngleX;
//         //public float endAngleY;
//         //public float endAngleZ;
//         public string errorMessage;
//     }






  constructor(private service: ClientServService) { }
   vertex = ` 
   attribute  vec4 vPosition;

   uniform mat4 modelViewMatrix;
   uniform mat4 projectionMatrix;

   void main()
   {
       gl_Position = projectionMatrix * modelViewMatrix * vPosition;
   }
    `

    fragmetnt=`
    precision mediump float;

    void main()
    {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);

    }
    `;


  ngOnInit(): void { 
    
  }

  startWorkout() {
    this.workoutInProgress = true;
    //while (this.workoutInProgress) {
    this.getData(); 
   // }
    // listening to http .... should get: slider num, angle
    // const slider_element = document.getElementById("slider9");
    // const new_event = new CustomEvent('change', { detail: {angle : -150 }});
    // slider_element.dispatchEvent(new_event);
    }

  getData() {
    this.service.getData( "param1", "param2");
  }
  moveStickman (arr: number[]) {
    arr.forEach((item, index)=>{
      this.moveByAngleAndSlider(item,index);
    })
  }
  moveByAngleAndSlider (angle : number, index: number) {
    // here you need to move the right slider according to the index you got!
    if(index == 0) {
    const slider_element = document.getElementById("slider8");
    const new_event = new CustomEvent('change', { detail: {angle : angle }});
    slider_element.dispatchEvent(new_event);
    }
    if(index == 1) {
      const slider_element = document.getElementById("slider9");
      const new_event = new CustomEvent('change', { detail: {angle : angle }});
      slider_element.dispatchEvent(new_event);
      }

  }
  printRemark (remark: string) {}



  // .map((res: Response) => res.json())
  // .subscribe((json: Object) => {
  //     this.user = new User().fromJSON(json);

 

  changeToAngleOne() {
    const slider_element = document.getElementById("slider0");
    const new_event = new CustomEvent('change', { detail: {angle : 100 }});
    slider_element.dispatchEvent(new_event);
  }
  changeToAngleTwo() {
    const slider_element = document.getElementById("slider9");
    const new_event = new CustomEvent('change', { detail: {angle : 100 }});
    slider_element.dispatchEvent(new_event);
  }
  changeToAngleThree() {
    const slider_element = document.getElementById("slider9");
    const new_event = new CustomEvent('change', { detail: {angle : 100 }});
    slider_element.dispatchEvent(new_event);
  }


}
