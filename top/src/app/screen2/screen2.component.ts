import { Component, ViewChild, OnInit } from '@angular/core';
import { EntryComponent } from '../entry/entry.component';

@Component({
  selector: 'app-screen2',
  standalone: true,
  imports: [EntryComponent],
  templateUrl: './screen2.component.html',
  styleUrl: './screen2.component.css',
})
export class Screen2Component implements OnInit {
  @ViewChild(EntryComponent) entry!: EntryComponent;
  scr1Data: string = '';
  scr2Data: string = '';
  
  submitData() {
    this.scr1Data = this.entry.inputData;
    this.scr2Data = this.entry.inputData;
  }
  ngOnInit(): void {
    this.scr2Data = '初期値';
  }
}
