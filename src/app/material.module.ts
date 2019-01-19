import { NgModule } from '@angular/core';

import {
  MatButtonModule,
  MatGridListModule,
  MatSlideToggleModule,
  MatCardModule
 } from '@angular/material';

@NgModule({
  imports: [
    MatButtonModule,
    MatGridListModule,
    MatSlideToggleModule,
    MatCardModule
  ],
  exports: [
    MatButtonModule,
    MatGridListModule,
    MatSlideToggleModule,
    MatCardModule
  ],

})
export class MaterialModule { }
