import { Component, OnInit } from '@angular/core';
import { Comp0Component } from "../comp0/comp0.component";
import { Comp1Component } from "../comp1/comp1.component";
import { Comp2Component } from "../comp2/comp2.component";

@Component({
  selector: 'app-screen3',
  standalone: true,
  imports: [Comp0Component, Comp1Component, Comp2Component],
  templateUrl: './screen3.component.html',
  styleUrl: './screen3.component.css'
})
export class Screen3Component {
    lastTest: boolean = false;

    ngOnInit(){
      this.lastTest = true
    }
}
