import { Component, OnInit } from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  private tileList: Tile[] = [];
  ships: Ship[];

  constructor() {
    for (let i = 0; i < 10*10; i++) {
         const data = new Tile(i,0);
         this.tileList.push(data);
    }

    this.ships = [
      new Ship("Carrier", 5, 1),
      new Ship("Battleship", 4, 1),
      new Ship("Cruiser", 3, 1),
      new Ship("Submarine", 3, 1),
      new Ship("Destroyer", 2, 1)
    ];
  }

  tryDrop(tileID,shipSize,orientation) {
    if(orientation == 1){//horisontal to the right
      if( ((tileID%10)+shipSize -1 < 10 )){
          for(let i = tileID; i<tileID+shipSize; i++)
            this.tileList[i].color = "#999393";
          return true;
      } else
        return false;
    }
    if(orientation == 2){//vertical downwards
      if( tileID/10+shipSize < 10){
          let i = tileID;
          for(let cnt = 0; cnt<shipSize; cnt++ ){
              this.tileList[i].color = "#999393";
              i+=10;
            }
          return true;
      }
      return false;
    }
    if(orientation == 3){//horisontal to the left
      if( (tileID%10)-shipSize >=0){
        for(let i=tileID; i>tileID-shipSize; i--)
          this.tileList[i].color = "#999393";
        return true;
      }
      return false;
    }
    if(orientation == 0){ // vertical upwards
      if(tileID/10 - shipSize +1 >=0){
        let i = tileID;
        for(let cnt = 0; cnt<shipSize;cnt++){
          this.tileList[i].color="#999393";
          i-=10;
        }
        return true;
      }
      return false;
    }
    return false;
  }

  rotate(ship) {
    ship.orientation = (ship.orientation + 1) % 2;

    // Simulate rotation by swapping dimensions
    let temp:number = ship.height;
    ship.height = ship.width;
    ship.width = temp;
  }

  getRotationAngle(ship) {
    return Math.abs((ship.orientation - 1) * 90 % 180);
  }

  ngOnInit() {
    this.tryDrop(9,9,3);
  }

}

export class Tile{
  private id:number;
  private val:number;
  public color:string;

  constructor(id,val) {
      this.id = id;
      this.val = val;
      this.color= "#E7DFDF";
  }
}

class Ship {
  type: string;
  orientation: number;
  size: number;
  width: number;
  height: number;

  constructor(type: string, size: number, orientation: number) {
    this.type = type;
    this.orientation = orientation;
    this.size = size;
    this.width = this.size * 50;
    this.height = 25;
  }
}
