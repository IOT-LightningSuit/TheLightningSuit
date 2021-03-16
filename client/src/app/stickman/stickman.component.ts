import { Component, OnInit } from '@angular/core';
import { ClientServService } from '../client-serv.service';

@Component({
  selector: 'app-stickman',
  templateUrl: './stickman.component.html',
  styleUrls: ['./stickman.component.css']
})
export class StickmanComponent implements OnInit {

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
    this.getData(); 
  }

  // alertFunc() {
  //   debugger;
  //   alert("HELLO!")
  // }

  startWorkout() {
    // listening to http .... should get: slider num, angle
    const slider_element = document.getElementById("slider9");
    const new_event = new CustomEvent('change', { detail: {angle : 100 }});
    slider_element.dispatchEvent(new_event);
    }

  getData() {
    //this.service.getData().subscribe(val=>console.log("THE VALUE IS:" + val))

  }

  dummy(){
    
  }

}
