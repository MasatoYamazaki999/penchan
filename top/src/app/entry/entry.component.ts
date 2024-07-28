import { Component, OnInit, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-entry',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './entry.component.html',
  styleUrl: './entry.component.css'
})
export class EntryComponent {
  @Input() paramData: string = '';
  inputData: string = '';
  constructor() {}
}
