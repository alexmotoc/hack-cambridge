import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { ShipSelectorComponent } from './ship-selector/ship-selector.component';

@NgModule({
  declarations: [
    AppComponent,
    ShipSelectorComponent
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
