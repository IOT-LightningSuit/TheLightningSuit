import { Component, OnInit } from '@angular/core';
import { IData } from './serverData'
import { map } from 'rxjs/operators'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { stringify } from '@angular/compiler/src/util';


@Component({
  selector: 'app-stickman',
  templateUrl: './stickman.component.html',
  styleUrls: ['./stickman.component.css']
})
export class StickmanComponent implements OnInit {
  workoutInProgress : boolean;
  message : string;
  workoutOngoing : boolean;
  timerStarted : boolean;
  
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






  constructor( private http: HttpClient, private router: Router) {
    this.workoutOngoing=false;
    this.timerStarted=false;
   }
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

    private _subscription:Subscription = new Subscription();
  ngOnInit(): void { 
    
  }
  ngOnDestroy() {

  }
  timer$=Subscription;


  startWorkout() {
    
    this.workoutOngoing = true;
    var userParam = localStorage.getItem('userParam')
    localStorage.removeItem('currentGame');
    
    //while (this.workoutInProgress) {
    this.getData(); 
   // }
    // listening to http .... should get: slider num, angle
    // const slider_element = document.getElementById("slider9");
    // const new_event = new CustomEvent('change', { detail: {angle : -150 }});
    // slider_element.dispatchEvent(new_event);
    }

    endWorkout(grade : number, name: string) {
      this.http.get<any>('http://192.168.0.97:5000/sensorsdata/' + name + '/' + grade).subscribe((res:any) => {
        localStorage.setItem('userAverage', JSON.stringify(res));
   });
     localStorage.setItem('userGrade', JSON.stringify(grade));
      this.router.navigateByUrl('/summary');
    }
    
  getData() {
    var grade : number = 100;
    var user = JSON.parse(localStorage.getItem('userParam'));
    let timer : number;
   let workoutNum = user.workout;
   if (workoutNum==1) timer = 30;
    if (workoutNum==2) timer = 45;
   if (workoutNum==3) timer = 60;
   let exerciseName;
   if(user.exercise ==1) exerciseName = 'ShoulderPress';
   if(user.exercise ==2) exerciseName = 'LeftLegBack';


    var refreshId = setInterval( () => {this.http.get<IData[]>('http://192.168.0.97:5000/sensorsdata/' + exerciseName).subscribe ( (response:any) => { //192.168.0.7
    console.log(response[0]);
    this.message = response[0].remark;
    if(this.message !=="Good Job!") grade--;
    this.moveStickman(response[0].bodyAngles)
    this.message = this.message + " " + timer;
   timer--;
   if (timer==0) {
      clearInterval(refreshId); 
      this.endWorkout(grade, user.name);
    }
    console.log(timer);
  })
    
},1000);
  }


  
  moveStickman (arr: number[]) {
    arr.forEach((item, index)=>{
      this.moveByAngleAndSlider(arr, item, index);
    })
  }



  moveByAngleAndSlider (arr : number[], angle : number, index: number) {
    // here you need to move the right slider according to the index you got!
    // let offsetArray : number[] = [ 1.5, 180, 0, 0, 0, 130, 130 ];
    //angle -= offsetArray[index];

    switch(index)
    {
      case 0: //left arm
        angle = -180 + (angle - 35) * 1.8;  
        if (angle < 0) angle = 0;
        else if (angle > 180) angle = 180;
        const slider_element0 = document.getElementById("slider3");
        const new_event0 = new CustomEvent('change', { detail: {angle : angle }});
        slider_element0.dispatchEvent(new_event0);
        break;

      case 1:  
        angle = -((angle + 40) * 1.8);
        if (angle < 0) angle = 0;
        else if (angle > 180) angle = 180;
        const slider_element1 = document.getElementById("slider2");
        const new_event1 = new CustomEvent('change', { detail: {angle : angle }});
        slider_element1.dispatchEvent(new_event1);
        break;

      // case 2: //both shins
      // angle = -(angle - 97);
      //   var temp: Number;
      //  if (arr[3] < 90) temp = -angle;
      //  else if (arr[3] > 90) temp = -(angle - 90);
      //  else temp = 0;
      //   const slider_element2 = document.getElementById("slider7");
      //   const new_event2 = new CustomEvent('change', { detail: {angle : angle }});
      //   slider_element2.dispatchEvent(new_event2);

      //   // if (arr[4] < 57) temp = -angle;
      //   // else if (arr[4] > 57) temp = -(angle - 90);
      //   // else temp = 0;
      //   const slider_element22 = document.getElementById("slider9");
      //   const new_event22 = new CustomEvent('change', { detail: {angle : angle }});
      //   slider_element22.dispatchEvent(new_event22);
      //   break;

      case 3:
        angle =  -(angle - 81);
        const slider_element3 = document.getElementById("slider6");
        const new_event3 = new CustomEvent('change', { detail: {angle : angle }});
        slider_element3.dispatchEvent(new_event3);
        break;
      
      case 4:
        angle =  -(angle - 63);
        const slider_element4 = document.getElementById("slider8");
        const new_event4 = new CustomEvent('change', { detail: {angle : angle }});
        slider_element4.dispatchEvent(new_event4);
        break;

      case 5:
        angle = -((angle - 60) * 1.63)
        if (angle > 0) angle = 0;
        else if (angle < -180) angle = -180;
        const slider_element5 = document.getElementById("slider4");
        const new_event5 = new CustomEvent('change', { detail: {angle : angle }});
        slider_element5.dispatchEvent(new_event5);
        break;
      
      case 6:
        angle = (-130 + angle) * 1.8;
        if (angle > 0) angle = 0;
        else if (angle < -180) angle = -180;
        const slider_element6 = document.getElementById("slider5");
        const new_event6 = new CustomEvent('change', { detail: {angle : angle }});
        slider_element6.dispatchEvent(new_event6);
        break;


    }

  }
  printRemark (remark: string) {
    //alert(this.message);
  }



  // .map((res: Response) => res.json())
  // .subscribe((json: Object) => {
  //     this.user = new User().fromJSON(json);

 

  changeToAngleOne() {
    const slider_element = document.getElementById("slider0");
    const new_event = new CustomEvent('change', { detail: {angle : 30 }});
    slider_element.dispatchEvent(new_event);
  }
  changeToAngleTwo() {
    const slider_element = document.getElementById("slider0");
    const new_event = new CustomEvent('change', { detail: {angle : 60 }});
    slider_element.dispatchEvent(new_event);
  }
  changeToAngleThree() {
    const slider_element = document.getElementById("slider0");
    const new_event = new CustomEvent('change', { detail: {angle : 100 }});
    slider_element.dispatchEvent(new_event);
  }


}
