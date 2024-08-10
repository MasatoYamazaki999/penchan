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
  public users!: any;
  ngOnInit(): void {}
  async onClick(): Promise<any> {
    const res = await this.apiService.fetch();
    console.log('======================');
    console.log(res);
    console.log('----------------------');
    // this.mksInfo.forEach((child) => {
    //   // alert('■' + child.getValue());
    // });
  }
}
