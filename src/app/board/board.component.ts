import { Component, OnInit } from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  private tileList: Tile[] = [];
  ships: Ship[];
  placedShips: Ship[] = [];

  selectedShip: Ship;
  selectedTile: Tile;

  hits: Bomb[] = [];
  probasBoard: number[] = [];
  showProbas: number = 0;

  constructor(private http: HttpClient) {
    this.restartGame();
  }

  restartGame(){
    this.tileList = [];
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

    // this.hits = [];
    this.placedShips = [];
  }


  selectShip(ship){
    this.selectedShip = ship;
  }

  selectTile(tile){
    this.selectedTile = tile;
    console.log(this.selectedShip);
    console.log(this.selectedTile);
    if(this.tryDrop(tile.getId(),this.selectedShip.size, this.selectedShip.orientation)){
      console.log("Valid");
      this.selectedShip.head = tile.getId();
      this.placedShips.push(this.selectedShip);
      this.ships = this.ships.filter(obj => obj.type !== this.selectedShip.type);
      this.locatedShip(tile.getId(),this.selectedShip.size, this.selectedShip.orientation);

    }
    else
      console.log("Invalid");
  }

  getHit(id){
    let didHit = 0;
    this.tileList[id].val = 2;
    this.placedShips.forEach(function(ship) {
      if(orientation==1 && ship.head<=id && id<ship.head+ship.size &&ship.remainingTiles>0){
        console.log("WE'VE BEEN HIT!");
        ship.remainingTiles--;
        didHit = 1;
      }
      if(orientation==0 && ship.head%10==id%10 && ship.head/10<=id && id<ship.head/10+ship.size){
        console.log("WE've BEEN HIT!");
        ship.remainingTiles--;
        didHit = 1;
      }
    });
      this.hits.push(new Bomb(id,didHit));
  }

  getProbas(){
    const options = {headers: {'Content-Type': 'application/json'}};
    let data = [new Bomb(2,1), new Bomb(20,0)];
    console.log(JSON.stringify(data));
    let url = "https://angular-http-guide.firebaseio.com/courses.json";
    this.http.post(url, JSON.stringify(data), options).subscribe(
        (t) => console.log(t)
    );
  }

  locatedShip(tileID,shipSize,orientation){

    if(orientation == 1){//horisontal to the right
          for(let i = tileID; i<tileID+shipSize; i++){
            this.tileList[i].val = 1;
            this.tileList[i].color = "grey";
          }
    }
    if(orientation == 0){//vertical downwards
          let i = tileID;
          for(let cnt = 0; cnt<shipSize; cnt++ ){
            this.tileList[i].val = 1;
            this.tileList[i].color = "grey";
            i+=10;
          }
    }
/*    if(orientation == 3){//horisontal to the left
        for(let i=tileID; i>tileID-shipSize; i--){
            this.tileList[i].val = 1;
            this.tileList[i].color = "grey";
          }
    }
    if(orientation == 0){ // vertical upwards
        let i = tileID;
        for(let cnt = 0; cnt<shipSize;cnt++){
          this.tileList[i].val = 1;
          this.tileList[i].color = "grey";
          i-=10;
        }
      }*/
  }

  tryDrop(tileID,shipSize,orientation) {
    if(orientation == 1){//horisontal to the right
      if( ((tileID%10)+shipSize -1 < 10 )){
          for(let i = tileID; i<tileID+shipSize; i++){
            if(this.tileList[i].val != 0 )
              return false;
          }
          return true;
      } else
        return false;
    }
    if(orientation == 0){//vertical downwards
      if( tileID/10+shipSize < 10){
          let i = tileID;
          for(let cnt = 0; cnt<shipSize; cnt++ ){
            if(this.tileList[i].val != 0 )
              return false;
            i+=10;
          }
          return true;
      }
      return false;
    }
  /*  if(orientation == 3){//horisontal to the left
      if( (tileID%10)-shipSize >=0){
        for(let i=tileID; i>tileID-shipSize; i--)
        if(this.tileList[i].val != 0 )
          return false;
        return true;
      }
      return false;
    }
    if(orientation == 0){ // vertical upwards
      if(tileID/10 - shipSize +1 >=0){
        let i = tileID;
        for(let cnt = 0; cnt<shipSize;cnt++){
          if(this.tileList[i].val != 0 )
            return false;
          i-=10;
        }
        return true;
      }
      return false;
    }*/
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
    this.getProbas();
  }

}

export class Tile{
   id:number;
   val:number;
  public color:string;

  constructor(id,val) {
      this.id = id;
      this.val = val;
      this.color= "#E7DFDF";
  }
  getId(){
    return this.id;
  }
}

class Ship {
  type: string;
  orientation: number;
  size: number;
  width: number;
  height: number;
  head: number;
  remainingTiles: number;

  constructor(type: string, size: number, orientation: number) {
    this.type = type;
    this.orientation = orientation;
    this.size = size;
    this.width = size * 50;
    this.height = 25;
    this.head = -1;
    this.remainingTiles = size;
  }
}

class Bomb {
  id: number; //where the hit was.
  hit: number; // 1-hit, 0-miss.

  constructor(id, hit){
    this.id = id;
    this.hit = hit;
  }
}
