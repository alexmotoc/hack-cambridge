import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { MatSnackBar, MatDialogModule } from '@angular/material';


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
  showProbas: boolean = false;
  nextMoveId: number = 0;
  finishedGame: boolean = false;
  counterMoves: number = 0;
  survivingShips: number = 0;

  colorMap: string[];

  loggedMessages: string[];

  constructor(private http: HttpClient, public snackBar: MatSnackBar) {
    this.colorMap = [
      '#ffffe0','#ffe3af','#ffc58a','#ffa474','#fa8266','#ed645c','#db4551','#c52940','#aa0e27','#8b0000'
    ];
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
    this.hits = [];
    this.showProbas = false;
    this.probasBoard = [];
    for(let i=0;i<10*10;i++)
      this.probasBoard.push(0);
    this.finishedGame = false;
    this.loggedMessages = [];
    this.counterMoves = 0;
    this.survivingships = 0;
    //this.getProbas();
  }

  showprobas(){
    this.showProbas= !this.showProbas;
  /*  if(!this.loadedProbas){
      this.getProbas();
    }*/
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
      duration: 5000,
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
    let data = {'hits':this.hits,'boats':sizes};
    console.log("SENDING DATA...");
    console.log(data);
    let url = "http://localhost:8080/calculate";
    this.http.post(url, JSON.stringify(data), options).subscribe(
        (t) => { this.loadedProbas=1; this.probasBoard = t['probs']; this.nextMoveId = this.calculateNextMove();}
    );
  }

  getColour(proba,id) {
    let alreadyhit = 0; //0 never tried, 1 tried and missed, 2 tried and scored

    this.hits.forEach(function(bomb) {
      if(bomb.id == id && bomb.hit==0)
        alreadyhit = 1;
      if(bomb.id == id && bomb.hit==1)
        alreadyhit = 2;
    });
    if(alreadyhit == 1)
      return "grey";
    if(alreadyhit == 2)
      return "green";
    return this.colorMap[(Math.floor(Math.min(proba, 99) / 10))];
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
