import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-comp2',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './comp2.component.html',
  styleUrl: './comp2.component.css'
})
export class Comp2Component {

  // 明細最終ライン
  @Input() lastLine: boolean = false;

  // 入力・表示用フラグ
  @Input() entryMode: boolean = true;

  // 最終ラインの色
  lineColor: string = '';

  shared: string = 'initial value';
  name: string = '....'
  @Input() partsId: string = '';
  
  // コンストラクタ
  constructor() {}
  
  // 初期表示処理
  ngOnInit(): void {
    if(this.lastLine){
      this.lineColor = '1px gray solid'
    } else {
      this.lineColor = '1px lightgray solid'
    }
  }
  getData(): string {
    return  this.name
  }
}
