import { Component, OnInit, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-vp-text',
  templateUrl: './vp-text.component.html',
  styleUrls: ['./vp-text.component.css']
})

export class VpTextComponent implements OnInit {
  lineColor: string = '1px lightgray solid';
  name: string = ''
  constructor() { }

  ngOnInit(): void {
  }
  getData(): string {
    return  this.name
  }
}
