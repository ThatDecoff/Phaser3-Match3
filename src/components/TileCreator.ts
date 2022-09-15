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
				var newTile = this.gameObject.scene.add.image(CurrentX, CurrentY, "");
				newTile.scaleX = 0.5;
				newTile.scaleY = 0.5;

				var tileScript = new Tiles(newTile);
				var index = Math.round(Math.random()*4);
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

	public GetTile(x: number, y: number){
		if(x < this.tileArray.length){
			if(y < this.tileArray[x].length){
				return this.tileArray[x][y];
			}
		}
		return null;
	}

	public GetAllTiles(){
		return this.tileArray;
	}

	public CheckNeighbor(tile1: Tiles, tile2: Tiles){
		var coord1 = tile1.GetCoord();
		var coord2 = tile2.GetCoord();

		if(!this.CheckTileExist(coord2)){
			return false;
		}

		for (var i = -1; i <= 1; i++){
			for (var j = -1; j <= 1; j++){
				if(i == 0 && j == 0){
					continue;
				}
				if(coord1.x % 2 == 0 && i != 0 && j == -1){
					continue;
				}
				if(coord1.x % 2 != 0 && i != 0 && j == 1){
					continue;
				}

				var newCoord: Vector2 = {x: coord1.x+i, y: coord1.y+j}
				if(coord2.x == newCoord.x && coord2.y == newCoord.y){
					return true;
				}
			}
		}
		return false;
	}

	public CheckTileExist(tileCoord: Vector2){
		if(tileCoord.x >= 0 && tileCoord.x < this.tileArray.length){
			if(tileCoord.y >= 0 && tileCoord.y < this.tileArray[tileCoord.x].length){
				return true;
			}
		}
		return false;
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
