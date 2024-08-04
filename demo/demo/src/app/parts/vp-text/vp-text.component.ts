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
  // 表タイトル
  @Input() title: string = '';
  // 必須
  @Input() required: boolean = false;
  // 必須位置
  @Input() requiredPos: string = '0px';

  // ヘッダーテキスト
  @Input() headerText: string = '';

  // ヘッダー幅
  @Input() headerWidth:string = '';
  // コンテンツ幅
  @Input() contentsWidth: string = '';

  // 最終ラインの色
  lineColor: string = '';

  // 必須スタイル
  requiredStyle: any;

  // ヘッダースタイル
  headerStyle: any;
  // タイトルスタイル
  titleStyle: any;
  // コンテンツスタイル
  contentsStyle: any;

  constructor() {}

  ngOnInit(): void {
    if (this.lastLine) {
      this.lineColor = '1px gray solid';
    } else {
      this.lineColor = '1px lightgray solid';
    }
    if (this.entry) {
      this.headerStyle = {
        display: 'flex',
        width: this.headerWidth + 'px',
        height: '80px',
        'background-color': '#f2f2f2',
      };
    } else {
      this.headerStyle = {
        display: 'flex',
        width: this.headerWidth + 'px',
        height: '40px',
        'background-color': '#f2f2f2',
      };
    }
    this.contentsStyle = { width: parseInt(this.contentsWidth) + 'px' };
    this.requiredStyle = {
      'margin-top': this.requiredPos,
      'vertical-align': 'top'
    };
    this.titleStyle = {
      width: parseInt(this.headerWidth) + parseInt(this.contentsWidth) + 'px',
      'font-weight': 'bold',
      'font-size': '14px',
      'border-bottom': '1px gray solid',
    };
  }
  getData(): string {
    return this.value;
  }
}
