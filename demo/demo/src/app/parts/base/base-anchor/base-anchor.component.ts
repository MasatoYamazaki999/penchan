import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-base-anchor',
  templateUrl: './base-anchor.component.html',
  styleUrls: ['./base-anchor.component.css']
})
export class BaseAnchorComponent implements OnInit {
  // 値
  @Input() value: string;
  
  constructor() {
    this.value = '';
  }

  ngOnInit(): void {
  }

}
