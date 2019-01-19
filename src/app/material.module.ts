import { NgModule } from '@angular/core';

import {
  MatButtonModule,
  MatListModule,
  MatGridListModule
 } from '@angular/material';

@NgModule({
  imports: [
    MatButtonModule,
    MatListModule,
    MatGridListModule
  ],
  exports: [
    MatButtonModule,
    MatListModule,
    MatGridListModule
  ]
})
export class MaterialModule { }
