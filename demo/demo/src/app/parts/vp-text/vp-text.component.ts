import { Component, OnInit, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-vp-text',
  templateUrl: './vp-text.component.html',
  styleUrls: ['./vp-text.component.css'],
})
export class VpTextComponent implements OnInit {
  // 入力・表示
  @Input() entry: boolean = true;
  // 明細最終ライン
  @Input() lastLine: boolean = false;
    // 値
  @Input() value: string = '';
  // 最終ラインの色
  lineColor: string = '';

  // スタイル
  headerStyle: any
  contentsStyle: any
  constructor() {}

  ngOnInit(): void {
    if (this.lastLine) {
      this.lineColor = '1px gray solid';
    } else {
      this.lineColor = '1px lightgray solid';
    }
    if(this.entry){
      this.headerStyle = {
        display: 'flex',
        width: '160px',
        height: '80px',
        'background-color': '#f2f2f2',
      };
      this.contentsStyle = { width: '400px', height: '80px' };
    } else {
      this.headerStyle = {
        display: 'flex',
        width: '160px',
        height: '40px',
        'background-color': '#f2f2f2',
      };
      this.contentsStyle = { width: '400px', height: '40px' };
    }
    
  }
  getData(): string {
    return this.value;
  }
}
