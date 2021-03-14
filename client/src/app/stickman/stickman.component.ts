import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-stickman',
  templateUrl: './stickman.component.html',
  styleUrls: ['./stickman.component.css']
})
export class StickmanComponent implements OnInit {

  constructor() { }
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
    `
  ngOnInit(): void {
    
  }

}
