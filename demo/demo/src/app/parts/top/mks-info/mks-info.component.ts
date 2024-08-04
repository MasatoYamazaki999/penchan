import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mks-info',
  templateUrl: './mks-info.component.html',
  styleUrls: ['./mks-info.component.css']
})
export class MksInfoComponent implements OnInit {
  mksnmkj: string = '';
  constructor() { }

  ngOnInit(): void {
    this.mksnmkj = '最上位からの値';
  }

}
