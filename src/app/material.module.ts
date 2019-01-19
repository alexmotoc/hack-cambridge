import { NgModule } from '@angular/core';

import {
  MatButtonModule,
  MatGridListModule
 } from '@angular/material';

@NgModule({
  imports: [
    MatButtonModule,
    MatGridListModule
  ],
  exports: [
    MatButtonModule,
    MatGridListModule
  ],

})
export class MaterialModule { }
