import { NgModule } from '@angular/core';

import {
  MatButtonModule,
  MatGridListModule,
  MatCardModule,
  MatSnackBarModule,
  MatSlideToggleModule,
  MatRadioModule
 } from '@angular/material';

 import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    MatButtonModule,
    MatGridListModule,
    MatCardModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatRadioModule
  ],
  exports: [
    MatButtonModule,
    MatGridListModule,
    MatCardModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatRadioModule
  ],

})
export class MaterialModule { }
