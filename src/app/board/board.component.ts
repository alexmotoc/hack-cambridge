import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { MatSnackBar, MatDialogModule } from '@angular/material';

let colormap = require('colormap');

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})


export class BoardComponent implements OnInit {

  tileList: Tile[] = [];
  ships: Ship[];
  placedShips: Ship[] = [];

  selectedShip: Ship;
  selectedTile: Tile;

  hits: Bomb[] = [];

  probasBoard: number[] = [];
  loadedProbas: number = 0;
  loadedProbasB: boolean = false;
  showProbas: boolean = false;
  useKeanu: boolean = false;
  nextMoveId: number = 0;
  finishedGame: boolean = false;
  counterMoves: number = 0;
  survivingShips: number = 0;

  colorMap: string[];

  loggedMessages: string[];

  constructor(private http: HttpClient, public snackBar: MatSnackBar) {
    this.colorMap = colormap({
        colormap: 'cubehelix',
        nshades: 150,
        format: 'hex',
        alpha: 1
    });
    this.restartGame();
  }

  restartGame(){
    this.tileList = [];
    for (let i = 0; i < 10*10; i++) {
         const data = new Tile(i, 0, "lightblue");
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
    this.loadedProbas = 0;
    this.loadedProbasB = false;
    this.hits = [];
    this.showProbas = false;
    this.probasBoard = [];
    for(let i=0;i<10*10;i++)
      this.probasBoard.push(0);
    this.finishedGame = false;
    this.loggedMessages = [];
    this.counterMoves = 0;
    this.survivingShips = 0;
    this.useKeanu = false;

    console.log(this.colorMap);
    //this.getProbas();
  }

  makeBool(i){
    if(i==0)
      return false;
    return true;
  }

  showprobas(){
    this.showProbas= !this.showProbas;
  }

  toggleKeanu(){
    if(this.useKeanu == true)
      this.useKeanu = false;
    else
      this.useKeanu = true;
    this.getProbas();
  }

  min(a,b){
    if(a<b)
      return a;
    return b;
  }

  selectShip(ship){
    this.selectedShip = ship;
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000 ,verticalPosition: 'bottom', horizontalPosition: 'start'
    });
  }

  selectTile(tile){
    if(this.placedShips.length<5){
      this.selectedTile = tile;

      if(this.tryDrop(tile.getId(),this.selectedShip.size, this.selectedShip.orientation)){
        this.selectedShip.head = tile.getId();
        this.placedShips.push(this.selectedShip);
        if(this.placedShips.length==5){
          this.getProbas();
        }
        this.ships = this.ships.filter(obj => obj.type !== this.selectedShip.type);
        this.locatedShip(tile.getId(),this.selectedShip.size, this.selectedShip.orientation);
        this.survivingShips ++;
        this.selectedShip =  null;
      }
      else {
        this.openSnackBar('Invalid position! Try again!', '');
        this.logMessage("Invalid position! Try again!");
      }
    }
  }

  getPrettyCoords(id){
    let letters=["A","B","C","D","E","F","G","H","I","J","K","L","M"];
    //console.log(id/10);
    let row = letters[Math.floor(id/10)];
    let col = id%10;
    return "("+row+","+col+")";
  }


  sunk(ship){
    this.survivingShips--;
    this.hits.forEach(function(hit) {
      if(ship.orientation==1 && ship.head<=hit.id && hit.id<ship.head+ship.size)
        hit.hit = 0;
      if(ship.orientation==0 && ship.head%10==hit.id%10 && Math.floor(ship.head/10)<=Math.floor(hit.id/10) && Math.floor(hit.id/10)<Math.floor(ship.head/10)+ship.size){
        hit.hit=0;
      }
    });
  }


  inship(ship,id){
    if(ship.orientation==1 && ship.head<=id && id<ship.head+ship.size)
      return true;
    if(ship.orientation==0 && ship.head%10==id%10 && Math.floor(ship.head/10)<=Math.floor(id/10) && Math.floor(id/10)<Math.floor(ship.head/10)+ship.size)
      return true;
    return false;

  }

  getHit(id){
    let didHit = 0;
    let survivingships = 0;
    let bindthis = this;
    let hitship;
    let didSink = 0;
    this.placedShips.forEach(function(ship) {
      if(ship.orientation==1 && ship.head<=id && id<ship.head+ship.size &&ship.remainingTiles>0){
        bindthis.logMessage("We have been hit at " + bindthis.getPrettyCoords(id) + "!");
        ship.remainingTiles--;
        if(ship.remainingTiles==0){
          bindthis.logMessage("Ship is down!");
          hitship = ship;
          didSink = 1;
          //bindthis.sunk(ship);
        }
        didHit = 1;
      }
      if(ship.orientation==0 && ship.head%10==id%10 && Math.floor(ship.head/10)<=Math.floor(id/10) && Math.floor(id/10)<Math.floor(ship.head/10)+ship.size && ship.remainingTiles>0){
        bindthis.logMessage("We have been hit at " + bindthis.getPrettyCoords(id) + "!");
        ship.remainingTiles--;
        if(ship.remainingTiles==0){
          bindthis.logMessage("Ship is down!")
          hitship = ship;
          didSink = 1;
          //bindthis.sunk(ship);
        }
        didHit = 1;
      }
      if(ship.remainingTiles>0){
        survivingships++;
      }
    });
      this.hits.push(new Bomb(id,didHit));
      if(didSink)
        this.sunk(hitship);
      console.log(id);
      console.log(this.tileList);
      this.tileList[id].val = 0;
      if(survivingships==0){
        this.logMessage("All ships are down. We lost :( !")
        this.finishedGame = true;
      }
      return didHit;
  }

  attempted(id){
    //1 if the id has already been tried
    let pp = 0;
    this.hits.forEach(function(bomb) {
      if(bomb.id == id){
        pp=1;
      }
    });
    return pp;
  }

  logMessage(m){
    this.openSnackBar(m,'');
    this.loggedMessages.push(m);
  }

  calculateNextMove(){
    let max = -1;
    let imax = -1;
    for(let i=0;i<10*10;i++){
      if(this.probasBoard[i]>max)
      {
        if(this.attempted(i)==0){
          max = this.probasBoard[i];
          imax = i;
        }
      }
    }
    return imax;
  }

  nextMove(){//actually perform next move

    if(this.ships.length>0){
      this.logMessage("Please put all ships on the board before playing.");
    }
    else if(this.finishedGame){
      this.logMessage("The game is finished!");
    }
    else{

      //console.log("next move:");
      //console.log(this.nextMoveId);
      this.counterMoves ++;
      this.getHit(this.nextMoveId);
      this.loadedProbas = 0;
      this.loadedProbasB = false;
      this.getProbas();
    }
  }

  /*getProbaVal(item, id){
    if(this.getColour(parseFloat(item), parseInt(id)) == "green")
      return 100;
    return Math.min((parseFloat(item)*100).toFixed(2),100);
  }*/

  getProbas(){
    const options = {headers: {'Content-Type': 'application/json'}};
    let sizes = [];
    this.placedShips.forEach(function(ship){
      if(ship.remainingTiles>0)
        sizes.push(ship.size);
    });
    //this.hits= [new Bomb(0,0), new Bomb(1,0)];
    let k = 0;
    if(this.useKeanu)
      k=1;
    let data = {'hits':this.hits,'boats':sizes,'keanu':k};
    console.log("SENDING DATA...");
    console.log(data);
    let url = "http://localhost:8080/calculate";
    this.loadedProbas = 0;
    this.loadedProbasB = false;
    this.http.post(url, JSON.stringify(data), options).subscribe(
        (t) => { this.loadedProbas=1; this.loadedProbasB=true; this.probasBoard = t['probs']; this.nextMoveId = this.calculateNextMove();}
    );
  }

  getBorder(id){

    if(this.tileList[id].val)
      return "2px solid black";

  /*  let bindthis = this;
    this.placedShips.forEach(function(sh) {
        if(sh.remainingTiles == 0 && bindthis.inship(sh,id))
          return "2px solid black";
      });*/
    return "0px";
  }


  getImg(id){
    let bindthis = this;
    let imgpath = "---";
      this.placedShips.forEach(function(sh) {
          if(sh.remainingTiles == 0 && bindthis.inship(sh,id))
            imgpath = "url(cross.png)";
        });
      return imgpath;
  }

  getColour(proba,id) {
    let alreadyhit = 0; //0 never tried, 1 tried and missed, 2 tried and scored

    this.hits.forEach(function(bomb) {
      if(bomb.id == id && bomb.hit==0)
        alreadyhit = 1;
      if(bomb.id == id && bomb.hit==1)
        alreadyhit = 2;
    });

    let bindthis = this;
    this.placedShips.forEach(function(sh) {
      if(sh.remainingTiles == 0 && bindthis.inship(sh,id))
        alreadyhit = 3; //from sunken ship
    });


    if(alreadyhit == 1)
      return "lightgrey";
    if(alreadyhit == 2)
      return "lightpink";
    if(alreadyhit == 3)
      return "grey";
    return this.colorMap[149 - Math.floor(proba)];
  }

  getCross(proba,id) {
    let alreadyhit = 0; //0 never tried, 1 tried and missed, 2 tried and scored

    this.hits.forEach(function(bomb) {
      if(bomb.id == id && bomb.hit==0)
        alreadyhit = 1;
      if(bomb.id == id && bomb.hit==1)
        alreadyhit = 2;
    });

    let bindthis = this;
    this.placedShips.forEach(function(sh) {
      if(sh.remainingTiles == 0 && bindthis.inship(sh,id))
        alreadyhit = 3; //from sunken ship
    });


    if(alreadyhit == 1)
      return "grey";
    if(alreadyhit == 2)
      return "white";
    if(alreadyhit == 3)
      return "white";
    return "pink";
  }

  locatedShip (tileID,shipSize,orientation){

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
      if( Math.floor(tileID/10)+shipSize -1 < 10){
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
    console.log(this.loadedProbasB);
  }

}

export class Tile{
  id:number;
  val:number;
  color:string;

  constructor(id, val, color) {
      this.id = id;
      this.val = val;
      this.color = color;
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
  color:string;

  constructor(type: string, size: number, orientation: number) {
    this.type = type;
    this.orientation = orientation;
    this.size = size;
    this.width = size * 50;
    this.height = 25;
    this.head = -1;
    this.remainingTiles = size;
    this.color = "lightblue";
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
