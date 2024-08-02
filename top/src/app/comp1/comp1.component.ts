import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-comp1',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './comp1.component.html',
  styleUrl: './comp1.component.css',
})
export class Comp1Component {
  // 明細最終ライン
  @Input() lastLine: boolean = false;
  // 入力・表示用フラグ
  @Input() entryMode: boolean = true;

  // 最終ラインの色
  lineColor: string = '';
  name: string = ''
  // コンストラクタ
  constructor() {}

  // 初期表示処理
  ngOnInit(): void {
    if (this.lastLine) {
      this.lineColor = '1px gray solid';
    } else {
      this.lineColor = '1px lightgray solid';
    }
  }
  getData(): string {
    return  this.name
  }
}
