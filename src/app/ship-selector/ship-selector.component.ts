import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ship-selector',
  templateUrl: './ship-selector.component.html',
  styleUrls: ['./ship-selector.component.css']
})

export class ShipSelectorComponent implements OnInit {

  ships: Ship[];

  constructor() {
    this.ships = [
      new Ship("Carrier", 5, 0),
      new Ship("Battleship", 4, 0),
      new Ship("Cruiser", 3, 0),
      new Ship("Submarine", 3, 0),
      new Ship("Destroyer", 2, 0)
    ];
  }

  ngOnInit() {
  }

}

class Ship {
  type: string;
  orientation: number;
  size: number;

  constructor(type: string, size: number, orientation: number) {
    this.type = type;
    this.orientation = orientation;
    this.size = size;
  }
}
