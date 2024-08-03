import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-screen1',
  templateUrl: './screen1.component.html',
  styleUrls: ['./screen1.component.css'],
})
export class Screen1Component implements OnInit {
  value: string = '';

  constructor() {}

  ngOnInit(): void {
    this.value = '上からの値';
  }
}
