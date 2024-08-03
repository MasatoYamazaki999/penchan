import { Component, OnInit, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-vp-account-no',
  templateUrl: './vp-account-no.component.html',
  styleUrls: ['./vp-account-no.component.css'],
})
export class VpAccountNoComponent implements OnInit {
  // 明細最終ライン
  @Input() lastLine: boolean = false;
  // 最終ラインの色
  lineColor: string = '';
  // 表タイトル
  @Input() title: string = '';

  name: string = '';

  constructor() {}

  ngOnInit(): void {
    if (this.lastLine) {
      this.lineColor = '1px gray solid';
    } else {
      this.lineColor = '1px lightgray solid';
    }
  }
}
