import { Component, OnInit, ViewChild } from '@angular/core';
import { UserListComponent } from '../user-list/user-list.component';

@Component({
  selector: 'app-screen1',
  standalone: true,
  imports: [UserListComponent],
  templateUrl: './screen1.component.html',
  styleUrl: './screen1.component.css',
})
export class Screen1Component implements OnInit {
  parentData: string = '';
  scr1Data: string = '----';

  constructor() {
  }

  ngOnInit() {
    this.parentData = '親から子へ';
  }
  onReceiveData(event: string) {
    this.parentData = event;
  }
}
