import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-base-radio',
  templateUrl: './base-radio.component.html',
  styleUrls: ['./base-radio.component.css']
})
export class BaseRadioComponent implements OnInit {
  // 部品id
  @Input() id: string;
  // 値
  @Input() value: string;
  // 案内
  @Input() guide: string;
  // name
  @Input() name: string;
  
  sex = [
    { value: 'male', display: '男性' },
    { value: 'female', display: '女性' },
  ];

  constructor() {
    this.id = ''
    this.value = '';
    this.guide = ''
    this.name = ''
   }

  ngOnInit(): void {
  }

  public getValue(): string {
    return this.value;
  }
  setValue(value: string) {
    this.value = value;
  }

  getId(): string {
    return this.id;
  }
}
