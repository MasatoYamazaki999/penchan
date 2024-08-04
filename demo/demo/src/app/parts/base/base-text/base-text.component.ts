import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-base-text',
  templateUrl: './base-text.component.html',
  styleUrls: ['./base-text.component.css'],
})
export class BaseTextComponent implements OnInit {
  // 値
  @Input() value: string;
  // サイズ
  @Input() size: string;
  // 敬称
  @Input() suffix: string;

  constructor() {
    this.value = '';
    this.size = '';
    this.suffix = '';
  }

  ngOnInit(): void {}

  getValue(): string {
    return this.value;
  }
  setValue(value: string) {
    this.value = value;
  }
}
