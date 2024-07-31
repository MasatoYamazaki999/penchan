import { Component } from '@angular/core';
import { Comp0Component } from "../comp0/comp0.component";
import { Comp1Component } from "../comp1/comp1.component";
import { Comp2Component } from "../comp2/comp2.component";

@Component({
  selector: 'app-screen2',
  standalone: true,
  imports: [Comp0Component, Comp1Component, Comp2Component],
  templateUrl: './screen2.component.html',
  styleUrl: './screen2.component.css'
})
export class Screen2Component {

}
