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
	private animationSystem?: AnimationSystem;
	private soundSystem?: SoundSystem;

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
				newTile.setScale(0.5, 0.5);

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
		var tilePrev: number[][] = [];
		var tileImages: number[][] = [];
		for (var i = 0; i < this.BoardX; i++){
			tileCounter.push([]);
			tileImages.push([]);
			tilePrev.push([]);
			for (var j = 0; j < this.BoardY; j++){
				tileCounter[i].push(0);
				tileImages[i].push(0);
				tilePrev[i].push(-1);
			}
		}

		// Mark removed tiles
		for (var i = 0; i < consumedTiles.length; i++){
			var value = consumedTiles[i];
			tileCounter[value.x][value.y] += 1;
		}

		// Increment Counters
		for (var i = 0; i < tileCounter.length; i++){
			for (var j = tileCounter[i].length-2; j >= 0; j--){
				tileCounter[i][j] += tileCounter[i][j+1];
			}
		}

		// Swap Tile Colors
		for (var i = 0; i < tileCounter.length; i++){
			for (var j = 0; j < tileCounter[i].length; j++){
				var tile = Tiles.getComponent(this.tileArray[i][j]);
				if(j + tileCounter[i][j] < tileCounter[i].length){
					tileImages[i][j + tileCounter[i][j]] = tile.GetImage();
					tilePrev[i][j + tileCounter[i][j]] = j;
				}
				tile.SetImage(tileImages[i][j]);
			}
		}

		// Tile Down SFX
		if(this.soundSystem){
			this.soundSystem.PlaySound("tile_down");
		}

		// Tile Down Animation
		for (var i = 0; i < tilePrev.length; i++){
			for (var j = 0; j < tilePrev[i].length; j++){
				if(tilePrev[i][j] != j){
					var tileObj = this.GetTileImage({x: i, y: j});
					var prevTileObj = this.GetTileImage({x: i, y: tilePrev[i][j]});
					var color = Tiles.getComponent(this.tileArray[i][j]).GetImage();
					
					if(tileObj && prevTileObj){
						this.CollectTileAnimation(
							{x: i, y: j},
							{x: prevTileObj.x, y: prevTileObj.y},
							{x: tileObj.x, y: tileObj.y},
							color, false
						)
					}
					
				}
			}
		}

		// Generate new tiles
		for (var i = 0; i < tileCounter.length; i++){
			for (var j = 0; j < tileCounter[i][0]; j++){
				var tile = Tiles.getComponent(this.tileArray[i][j]);
				var index = Math.floor(Math.random()*5);
				var tileImage = tile.GetGameObject();

				tile.SetImage(index);
				this.CollectTileAnimation(
					{x: i, y: j},
					{x: tileImage.x, y: 110},
					{x: tileImage.x, y: tileImage.y},
					index, false
				);
			}
		}
		return tileCounter;
	}

	private CollectTileAnimation(destination: Vector2, startPos: Vector2, endPos: Vector2, color: number, selected: boolean){
		if(!this.animationSystem){
			return;
		}

		var gameObject = this.CreateTile(startPos, color, selected);

		var animation = new TileMoveAnimObj(
			gameObject, destination,
			startPos, endPos,
			this
		);
		animation.SetMultiplier(0.5);

		this.animationSystem.AddAnimation(animation);
	}

	public SwapTiles(tileList: [Vector2, Vector2][]){
		if(this.soundSystem){
			this.soundSystem.PlaySound("tile_collect");
		}

		for(var i = 0; i < tileList.length; i++){
			this.SwapTile(tileList[i][0], tileList[i][1]);
		}
	}

	public SwapTile(coord1: Vector2, coord2: Vector2){
		var tile1 = Tiles.getComponent(this.tileArray[coord1.x][coord1.y]);
		var tile2 = Tiles.getComponent(this.tileArray[coord2.x][coord2.y]);

		this.SwapTileAnimation(coord1, coord2);

		var image1 = tile1.GetImage();
		tile1.SetImage(tile2.GetImage());
		tile2.SetImage(image1);
	}

	private SwapTileAnimation(tile1: Vector2, tile2: Vector2){
		if(!this.animationSystem){
			return;
		}

		var tileObj1 = this.GetTileImage(tile1);
		var tileObj2 = this.GetTileImage(tile2);

		var tileScript1 = Tiles.getComponent(this.tileArray[tile1.x][tile1.y]);
		var tileScript2 = Tiles.getComponent(this.tileArray[tile2.x][tile2.y]);

		if(!tileObj1 || !tileObj2){
			return;
		}

		// console.log("Tile1");
		// console.log(tile1.x + " " + tile1.y);
		// console.log(tileObj1.x + " " + tileObj1.y);
		// console.log(tileObj2.x + " " + tileObj2.y);

		// var newObj1 = this.scene.add.image(tileObj1.x, tileObj1.y, "");
		// newObj1.setScale(0.5, 0.5);
		// newObj1.setTexture(Tiles.SelectedTextures[tileScript1.GetImage()]);
		var newObj1 = this.CreateTile({x: tileObj1.x, y: tileObj1.y}, tileScript1.GetImage(), false);

		var animation1 = new TileMoveAnimObj(
			newObj1, tile1,
			{x: tileObj1.x, y: tileObj1.y},
			{x: tileObj2.x, y: tileObj2.y},
			this
		)

		// console.log("Tile2");
		// console.log(tile2.x + " " + tile2.y);
		// console.log(tileObj2.x + " " + tileObj2.y);
		// console.log(tileObj1.x + " " + tileObj1.y);

		// var newObj2 = this.scene.add.image(tileObj2.x, tileObj2.y, "");
		// newObj2.setScale(0.5, 0.5);
		// newObj2.setTexture(Tiles.SelectedTextures[tileScript2.GetImage()]);
		var newObj2 = this.CreateTile({x: tileObj2.x, y: tileObj2.y}, tileScript2.GetImage(), false);

		var animation2 = new TileMoveAnimObj(
			newObj2, tile2,
			{x: tileObj2.x, y: tileObj2.y},
			{x: tileObj1.x, y: tileObj1.y},
			this
		)

		this.animationSystem.AddAnimation(animation1);
		this.animationSystem.AddAnimation(animation2);
	}

	public SetTileVisibility(tile: Vector2, value: boolean){
		var tileScript = this.GetTileScript(tile);
		if(tileScript){
			var tileObj = tileScript.GetGameObject();
			tileObj.setVisible(value);
		}
	}

	public CreateTile(position: Vector2, value: number, selected: boolean){
		var newObj = this.scene.add.image(position.x, position.y, "");
		newObj.setScale(0.5, 0.5);
		if(selected){
			newObj.setTexture(Tiles.SelectedTextures[value]);
		}
		else{
			newObj.setTexture(Tiles.IdleTextures[value]);
		}
		
		// var tileScript = new Tiles(newObj);
		// tileScript.SetImage(value);
		// tileScript.ToggleSelected(selected);
		return newObj;
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
		return;
	}

	public GetTileScript(tile: Vector2){
		var tileObj = this.GetTile(tile)
		if(tileObj){
			return Tiles.getComponent(tileObj);
		}
		return;
	}

	public GetTileImage(tile: Vector2){
		var tileObj = this.GetTile(tile)
		if(tileObj){
			return Tiles.getComponent(tileObj).GetGameObject();
		}
		return;
	}

	public GetTileColor(tile: Vector2){
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

	public SetAnimationSystem(animationSystem: AnimationSystem){
		this.animationSystem = animationSystem;
	}

	public SetSoundSystem(soundSystem: SoundSystem){
		this.soundSystem = soundSystem;
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
