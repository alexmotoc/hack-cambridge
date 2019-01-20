import { NgModule } from '@angular/core';

import {
  MatButtonModule,
  MatGridListModule,
  MatCardModule,
  MatSnackBarModule,
  MatSlideToggleModule,
  MatDialogModule
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
    MatDialogModule
  ],
  exports: [
    MatButtonModule,
    MatGridListModule,
    MatCardModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatDialogModule
  ],

})
export class MaterialModule { }
