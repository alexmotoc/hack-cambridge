import { NgModule } from '@angular/core';

import {
  MatButtonModule,
  MatGridListModule,
  MatCardModule,
  MatSnackBarModule,
  MatSlideToggleModule
 } from '@angular/material';

 import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    MatButtonModule,
    MatGridListModule,
    MatCardModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    MatSlideToggleModule
  ],
  exports: [
    MatButtonModule,
    MatGridListModule,
    MatCardModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    MatSlideToggleModule
  ],

})
export class MaterialModule { }
