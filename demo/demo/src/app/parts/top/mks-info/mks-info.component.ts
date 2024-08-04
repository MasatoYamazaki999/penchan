import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { TableTextComponent } from '../../middle/table-text/table-text.component';
import { TableRadioComponent } from '../../middle/table-radio/table-radio.component';

@Component({
  selector: 'app-mks-info',
  templateUrl: './mks-info.component.html',
  styleUrls: ['./mks-info.component.css'],
})
export class MksInfoComponent implements OnInit {
  @ViewChildren(TableTextComponent)
  public childs!: QueryList<TableTextComponent>;
  
  @ViewChildren(TableRadioComponent)
  public radioChilds!: QueryList<TableRadioComponent>;

  honor: string = '';
  mksnmkj: string = '';
  mksnmkn: string = '';
  mksnmkjHeaderText: string = '';
  mksnmknHeaderText: string = '';
  mkskjContentsText: string[] = [];
  mksknContentsText: string[] = [];
  jgnsexContentsText: string[] = []
  constructor() {}

  ngOnInit(): void {
    this.honor = 'さま';
    this.mksnmkj = '申込者(漢字)';
    this.mksnmkn = '申込者(フリガナ)';

    this.mksnmkjHeaderText = '申込者の氏名（漢字）';
    this.mksnmknHeaderText = '申込者の氏名（フリガナ）';

    this.mkskjContentsText = [
      '氏名（漢字）を全角で入力してください。姓と名の間には空白（全角）を入れてください。',
      '※アルファベットも入力できます。',
    ];
    this.mksknContentsText = [
      '氏名（フリガナ）を全角で入力してください。姓と名の間には空白（全角）を入れてください。',
      '※ひらがなでも入力できます。（確認画面でカタカナに変換されます）',
    ];
    this.jgnsexContentsText = ['性別を選択してください。']
;
  }

  public getValue(): any {
    let result: string[] = []
    
    this.childs.forEach(child => {
      result.push(child.getValue())
    })
    let ans = this.radioChilds.filter(n => n.id==='rd005');
    result.push(ans[0].getValue())
    return result;
  }
}
