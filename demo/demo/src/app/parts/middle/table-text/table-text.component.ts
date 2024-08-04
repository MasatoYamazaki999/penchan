import { Component, OnInit, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-table-text',
  templateUrl: './table-text.component.html',
  styleUrls: ['./table-text.component.css'],
})
export class TableTextComponent implements OnInit {
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
  // コンテンツテキスト(親から)
  @Input() contentsTextFromParent: string[] = [];

  // コンテンツテキスト(画面)
  contentsText: string = '';
  // ヘッダー幅
  @Input() headerWidth: string = '';
  // コンテンツ幅
  @Input() contentsWidth: string = '';
  // 高さ
  @Input() height: string = '';
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
  // コンテンツサイズ
  @Input() size: string = '';

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
        height: this.height + 'px',
        'background-color': '#f2f2f2',
      };
    } else {
      this.headerStyle = {
        display: 'flex',
        width: this.headerWidth + 'px',
        height: parseInt(this.height) / 2 + 'px',
        'background-color': '#f2f2f2',
      };
    }
    this.contentsStyle = {
      width: parseInt(this.contentsWidth) + 'px',
      'white-space': 'pre-wrap',
    };
    this.requiredStyle = {
      'margin-top': this.requiredPos,
      'vertical-align': 'top',
    };
    this.titleStyle = {
      width: parseInt(this.headerWidth) + parseInt(this.contentsWidth) + 'px',
      'font-weight': 'bold',
      'font-size': '14px',
      'border-bottom': '1px gray solid',
    };
    this.contentsText = '';
    for (let i = 0; i < 2; i++) {
      if (i == this.contentsTextFromParent.length - 1) {
        this.contentsText += this.contentsTextFromParent[i];
      } else {
        this.contentsText += this.contentsTextFromParent[i] + '\n  ';
      }
    }
  }
  getData(): string {
    return this.value;
  }
}
