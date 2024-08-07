import {
  Component,
  Input,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { BaseRadioComponent } from '../../base/base-radio/base-radio.component';

@Component({
  selector: 'app-table-radio',
  templateUrl: './table-radio.component.html',
  styleUrls: ['./table-radio.component.css'],
})
export class TableRadioComponent implements OnInit {
  // 部品id
  @Input() id: string = '';
  // 部品type
  @Input() type: string = '';
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
  // ヘッダー幅
  @Input() headerWidth: string = '';
  // コンテンツ幅
  @Input() contentsWidth: string = '';
  // 高さ
  @Input() height: string = '';

  // コンテンツテキスト(画面)
  contentsText: string = '';
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
  @Input() honor: string = '';

  // コンテンツサイズ
  @Input() size: string = '';

  @ViewChildren(BaseRadioComponent)
  public childs!: QueryList<BaseRadioComponent>;

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
    this.contentsText = this.contentsTextFromParent.join('\n  ');
  }
  getValue(): string {
    let result = '';
    this.childs.forEach((child) => {
      result += child.getValue();
    });
    return result;
  }
  getId(): string {
    return this.id;
  }
  setId(id: string) {
    this.id = id;
  }
}
