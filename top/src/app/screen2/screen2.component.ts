import { Component, ViewChild } from '@angular/core';
import { EntryComponent } from '../entry/entry.component';

@Component({
  selector: 'app-screen2',
  standalone: true,
  imports: [EntryComponent],
  templateUrl: './screen2.component.html',
  styleUrl: './screen2.component.css'
})
export class Screen2Component {
  @ViewChild(EntryComponent) entry!: EntryComponent;
  scr1Data: string = '';
  submitData() {
    this.scr1Data = this.entry.inputData;
  }
}
