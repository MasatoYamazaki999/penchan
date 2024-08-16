import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MksInfoComponent } from 'src/app/parts/top/mks-info/mks-info.component';
import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-screen1',
  templateUrl: './screen1.component.html',
  styleUrls: ['./screen1.component.css'],
})
@Injectable()
export class Screen1Component implements OnInit {
  @ViewChildren(MksInfoComponent)
  public mksInfo!: QueryList<MksInfoComponent>;
  constructor(private apiService: ApiService) {}

  ngOnInit(): void {}
  onClick(): void {
    this.mksInfo.forEach((child) => {
      alert('■' + child.getValue());
    });
  }
}
