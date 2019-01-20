import { NgModule } from '@angular/core';

import {
  MatButtonModule,
  MatGridListModule,
  MatCardModule,
  MatSnackBarModule,
  MatSlideToggleModule,
  MatDialogModule,
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
    MatDialogModule,
    MatRadioModule
  ],
  exports: [
    MatButtonModule,
    MatGridListModule,
    MatCardModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatRadioModule
  ],

})
export class MaterialModule { }
