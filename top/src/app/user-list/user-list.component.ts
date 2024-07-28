import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../model/user.model';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [NgFor, FormsModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent implements OnInit {
  @Input() childData: string = '';
  @Output() sharedData = new EventEmitter<string>();
  users: User[] = [];

  constructor() {}
  submitData() {
    this.sharedData.emit('子データ');
  }
  ngOnInit() {
    let user1 = new User('user1', '一郎', '田中', 'tanaka@test.com');
    let user2 = new User('user2', '二郎', '小林', 'kobayashi@test.com');
    this.users.push(user1);
    this.users.push(user2);
  }
}
