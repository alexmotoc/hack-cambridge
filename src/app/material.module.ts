import { NgModule } from '@angular/core';

import {
  MatButtonModule,
  MatGridListModule,
  MatSlideToggleModule,
 } from '@angular/material';

@NgModule({
  imports: [
    MatButtonModule,
    MatGridListModule,
    MatSlideToggleModule
  ],
  exports: [
    MatButtonModule,
    MatGridListModule,
    MatSlideToggleModule
  ],

})
export class MaterialModule { }
