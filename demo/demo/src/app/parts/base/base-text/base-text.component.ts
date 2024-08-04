import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-base-text',
  templateUrl: './base-text.component.html',
  styleUrls: ['./base-text.component.css'],
})
export class BaseTextComponent implements OnInit {
  // 部品id
  @Input() id: string;
  // 値
  @Input() value: string;
  // サイズ
  @Input() size: string;
  // 敬称
  @Input() suffix: string;
  // type
  @Input() type: string;

  constructor() {
    this.id = '';
    this.type = ''
    this.value = '';
    this.size = '';
    this.suffix = '';
  }

  ngOnInit(): void {}

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
