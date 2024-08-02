import { Component,  ViewChild,  AfterViewInit, ViewChildren, QueryList } from '@angular/core';
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
  @ViewChildren(Comp1Component) comp1Component!:  QueryList<Comp1Component>;
  @ViewChildren(Comp2Component) comp2Component!:  QueryList<Comp2Component>;

    ngAfterViewInit() {
  
    }
    ngOnInit(){

    }
    pushed(){
      let inputData = ''
      for(let item of this.comp1Component.toArray()){
        inputData += item.getData() + '\r\n'
      }
      for(let item of this.comp2Component.toArray()){
        inputData += item.getData() + '\r\n'
      }
      alert(inputData)
      // const element = this.comp2Component.filter((element) => element.partsId === 'id2');
      // console.log(element[0].getData())
      // alert('data is  ' + element[0].getData())
    }
}
