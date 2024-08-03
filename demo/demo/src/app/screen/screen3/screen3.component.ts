import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-screen3',
  templateUrl: './screen3.component.html',
  styleUrls: ['./screen3.component.css']
})
export class Screen3Component implements OnInit {
 @Input() value: string = '';
  constructor() { }

  ngOnInit(): void {
    this.value = '上からの値'
  }

}
