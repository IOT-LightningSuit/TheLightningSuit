import { Component, OnInit } from '@angular/core';
import { ClientServService } from '../client-serv.service';
import {modelData} from './data'
import {modelArray} from './dataArray'

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
    
  }

  startWorkout() {

    //this.getData(); 
    // listening to http .... should get: slider num, angle
    const slider_element = document.getElementById("slider9");
    const new_event = new CustomEvent('change', { detail: {angle : -150 }});
    slider_element.dispatchEvent(new_event);
    }

  getData() {
    this.service.getData( "param1", "param2").subscribe(data => {

      //let res = JSON.
  })

  }

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
