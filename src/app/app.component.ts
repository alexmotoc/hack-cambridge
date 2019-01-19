import { Component } from '@angular/core';
import {BoardComponent} from './board/board.component';
import {MatButtonModule, MatCheckboxModule} from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'hack-cambridge';
}
