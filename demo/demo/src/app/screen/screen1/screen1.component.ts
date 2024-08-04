import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MksInfoComponent } from 'src/app/parts/top/mks-info/mks-info.component';

@Component({
  selector: 'app-screen1',
  templateUrl: './screen1.component.html',
  styleUrls: ['./screen1.component.css'],
})
export class Screen1Component implements OnInit {
  @ViewChildren(MksInfoComponent)
  public mksInfo!: QueryList<MksInfoComponent>;

  constructor() {}

  ngOnInit(): void {}
  onClick(): void {
    this.mksInfo.forEach(child => {
      alert("■" + child.getValue())
    })
  }
}
