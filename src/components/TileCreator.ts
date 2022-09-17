/// <reference path="./UserComponent.ts"/>

// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

class TileCreator extends UserComponent {

	constructor(gameObject: Phaser.GameObjects.Image) {
		super(gameObject);

		this.gameObject = gameObject;
		(gameObject as any)["__TileCreator"] = this;

		/* START-USER-CTR-CODE */
		this.container = this.scene.add.container(0, 0);
		this.container.setName("CreatorContainer");
		/* END-USER-CTR-CODE */
	}

	static getComponent(gameObject: Phaser.GameObjects.Image): TileCreator {
		return (gameObject as any)["__TileCreator"];
	}

	private gameObject: Phaser.GameObjects.Image;

	/* START-USER-CODE */
	private container: Phaser.GameObjects.Container;

	// Hardcoded for now
	public TileWidth: number = 49.5;
	public TileHeight: number = 44;

	public StartX: number = 80;
	public StartY: number = 175;

	public BoardX: number = 7;
	public BoardY: number = 7;

	private tileArray: Phaser.GameObjects.GameObject[][] = [];

	override awake(){
		this.GenerateTile(this.BoardX, this.BoardY);
	}

	protected GenerateTile(tileX: number = 7, tileY: number = 7){
		const container = this.container;

		// Generate tiles, Hardcoded for now
		var CurrentX;
		var CurrentY;

		var IncrementX = 0.75 * this.TileWidth;
		var IncrementY = this.TileHeight;

		for (var i = 0; i < tileX; i++){
			this.tileArray.push([]);

			// Current Position
			CurrentX = this.StartX + (i * IncrementX);
			CurrentY = this.StartY;
			if(i % 2 == 0){
				CurrentY += 0.5 * IncrementY;
			}

			for (var j = 0; j < tileY; j++){
				var newTile = this.scene.add.image(CurrentX, CurrentY, "");
				newTile.scaleX = 0.5;
				newTile.scaleY = 0.5;

				var shape = new Phaser.Geom.Circle(49.5, 44, 44);
				newTile.setInteractive(shape, Phaser.Geom.Circle.Contains);

				var tileScript = new Tiles(newTile);
				var index = Math.floor(Math.random()*5);
				tileScript.SetImage(index);
				tileScript.SetCoord({x: i, y: j});

				container.add(newTile);
				this.tileArray[i].push(newTile);

				CurrentY += IncrementY;
			}
		}
	}

	public ConsumeTile(consumedTiles: Vector2[]){
		// Init Counter
		var tileCounter: number[][] = [];
		var tileImages: number[][] = [];
		for (var i = 0; i < this.BoardX; i++){
			tileCounter.push([]);
			tileImages.push([]);
			for (var j = 0; j < this.BoardY; j++){
				tileCounter[i].push(0);
				tileImages[i].push(0);
			}
		}

		// Mark removed tiles
		for (var i = 0; i < consumedTiles.length; i++){
			var value = consumedTiles[i];
			tileCounter[value.x][value.y] += 1;
			// for (var j = value.y; j >= 0; j++){
			// 	tileCounter[value.x][j] += 1;
			// }
		}

		// Increment Counters
		for (var i = 0; i < tileCounter.length; i++){
			for (var j = tileCounter[i].length-2; j >= 0; j--){
				tileCounter[i][j] += tileCounter[i][j+1];
				// if(j != tileCounter[i].length-1){
				// 	tileCounter[i][j] += tileCounter[i][j+1];
				// }
				// if(j - tileCounter[i][j] >= 0){
				// 	var tile = Tiles.getComponent(this.tileArray[i][j]);
				// 	var prevTile = Tiles.getComponent(this.tileArray[i][j - tileCounter[i][j]]);
				// 	tile.SetImage(prevTile.GetImage());
				// }
			}
		}

		// Swap Tile Colors
		for (var i = 0; i < tileCounter.length; i++){
			for (var j = 0; j < tileCounter[i].length; j++){
				var tile = Tiles.getComponent(this.tileArray[i][j]);
				if(j + tileCounter[i][j] < tileCounter[i].length){
					// var nextTile = Tiles.getComponent(this.tileArray[i][j + tileCounter[i][j]]);
					tileImages[i][j + tileCounter[i][j]] = tile.GetImage();
				}
				tile.SetImage(tileImages[i][j]);
			}
		}

		// Generate new tiles
		for (var i = 0; i < tileCounter.length; i++){
			for (var j = 0; j < tileCounter[i][0]; j++){
				var tile = Tiles.getComponent(this.tileArray[i][j]);
				var index = Math.round(Math.random()*4);
				tile.SetImage(index);
			}
		}
		return tileCounter;
	}

	public SwapTiles(tileList: [Vector2, Vector2][]){
		for(var i = 0; i < tileList.length; i++){
			this.SwapTile(tileList[i][0], tileList[i][1]);
		}
	}

	public SwapTile(coord1: Vector2, coord2: Vector2){
		var tile1 = Tiles.getComponent(this.tileArray[coord1.x][coord1.y]);
		var tile2 = Tiles.getComponent(this.tileArray[coord2.x][coord2.y]);

		var image1 = tile1.GetImage();
		tile1.SetImage(tile2.GetImage());
		tile2.SetImage(image1);
	}

	public GetBoardSize(): Vector2{
		return {
			x: this.BoardX,
			y: this.BoardY
		}
	}

	public GetTile(tile: Vector2){
		if(tile.x < this.tileArray.length){
			if(tile.y < this.tileArray[tile.x].length){
				return this.tileArray[tile.x][tile.y];
			}
		}
		return null;
	}

	public GetTileScript(tile: Vector2){
		var tileObj = this.GetTile(tile)
		if(tileObj){
			return Tiles.getComponent(tileObj);
		}
		return null;
	}

	public GetTileImage(tile: Vector2){
		var tileObj = this.GetTile(tile)
		if(tileObj){
			return Tiles.getComponent(tileObj).GetImage();
		}
		return -1;
	}

	public GetAllTiles(){
		return this.tileArray;
	}

	public GetTileNeighbors(position: Vector2){
		var result: Vector2[] = [];

		for (var i = -1; i <= 1; i++){
			for (var j = -1; j <= 1; j++){
				if(i == 0 && j == 0){
					continue;
				}
				if(position.x % 2 == 0 && i != 0 && j == -1){
					continue;
				}
				if(position.x % 2 != 0 && i != 0 && j == 1){
					continue;
				}

				var newCoord: Vector2 = {x: position.x+i, y: position.y+j}
				if(this.CheckTileExist(newCoord)){
					result.push(newCoord);
				}
			}
		}
		return result;
	}

	public CheckNeighbor(tile1: Tiles, tile2: Tiles){
		var coord1 = tile1.GetCoord();
		var coord2 = tile2.GetCoord();

		if(!this.CheckTileExist(coord1)){
			return false;
		}
		if(!this.CheckTileExist(coord2)){
			return false;
		}

		var neighbors = this.GetTileNeighbors(coord1);
		for (var i = 0; i < neighbors.length; i++){
			var neighbor = neighbors[i];

			if(coord2.x == neighbor.x && coord2.y == neighbor.y){
				return true;
			}
		}
		return false;
	}

	public CheckTileExist(position: Vector2){
		if(position.x >= 0 && position.x < this.tileArray.length){
			if(position.y >= 0 && position.y < this.tileArray[position.x].length){
				return true;
			}
		}
		return false;
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
