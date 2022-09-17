/// <reference path="./UserComponent.ts"/>

// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

class TileSelector extends UserComponent {

	constructor(gameObject: Phaser.GameObjects.Image) {
		super(gameObject);

		this.gameObject = gameObject;
		(gameObject as any)["__TileSelector"] = this;

		/* START-USER-CTR-CODE */
		this.container = this.scene.add.container(0, 0);
		this.container.setName("SelectorContainer");

		this.scoreText = this.scene.add.text(0, 0, "");
		this.scoreText.setName("ScoreText");
		this.scoreText.setFontSize(32);
		this.scoreText.setAlign("center");
		this.scoreText.setVisible(false);
		//this.scene.children.moveTo(this.container, 0);
		/* END-USER-CTR-CODE */
	}

	static getComponent(gameObject: Phaser.GameObjects.Image): TileSelector {
		return (gameObject as any)["__TileSelector"];
	}

	private gameObject: Phaser.GameObjects.Image;

	/* START-USER-CODE */
	private container: Phaser.GameObjects.Container;
	private scoreText: Phaser.GameObjects.Text;

	private tileCreator?: TileCreator;
	private levelSystem?: LevelSystem;

	private connectors: TileConnector[] = [];
	private tileList: Tiles[] = [];

	static ScoreFunction = function(value: number){
		return 10 * Math.pow(2, value);
	};

	public SelectTile(tile: Tiles){
		//console.log("Select Tile");
		if(tile.IsSelected()){
			return;
		}
		if(!this.tileCreator){
			return;
		}
		//console.log("Select Tile Pass");

		var prevTile = this.tileList[this.tileList.length-1];
		if(this.tileList.length > 0 && tile.GetImage() != prevTile.GetImage()){
			return;
		}
		if(this.tileList.length > 0 && !this.tileCreator.CheckNeighbor(tile, prevTile)){
			return;
		}

		console.log("Select Tile");

		tile.ToggleSelected(true);

		var gameObject = tile.GetGameObject();
		var ellipse = this.scene.add.ellipse(gameObject.x, gameObject.y, 10, 10);
		var rectangle = this.scene.add.rectangle(gameObject.x, gameObject.y, 0, 4);
		ellipse.isFilled = true;
		rectangle.setOrigin(0, 0.5);
		rectangle.isFilled = true;

		if(this.tileList.length > 0){
			var prevObj = prevTile.GetGameObject();
			var prevConnector = this.connectors[this.connectors.length-1];
			var polarCoord = Tiles.ToRadian({x: gameObject.x - prevObj.x, y: gameObject.y - prevObj.y});
			//console.log(polarCoord.r + " " + polarCoord.angle);
			prevConnector.edge.setSize(polarCoord.r, 4);
			prevConnector.edge.setAngle(polarCoord.angle);
		}

		this.container.add(ellipse);
		this.container.add(rectangle);

		this.tileList.push(tile);
		this.connectors.push({vertice: ellipse, edge: rectangle});

		this.UpdateScoreText();
	}

	public DeselectTile(){
		if(this.tileList.length > 0){
			console.log("Deselect Tile");
			var tile = this.tileList.pop();
			var connector = this.connectors.pop();

			if(!tile || !connector){
				return
			}

			if(this.tileList.length > 0){
				var prevConnector = this.connectors[this.connectors.length-1];
				prevConnector.edge.setSize(0, 4);
				prevConnector.edge.setAngle(0);
			}

			tile.ToggleSelected(false);
			connector.vertice.destroy();
			connector.edge.destroy();

			this.UpdateScoreText();
		}
	}

	public DeselectAllTile(){
		console.log("Deselect All Tile");
		while(this.tileList.length > 0){
			this.DeselectTile();
		}
	}

	public ValidateSelection(){
		if(!this.tileCreator || !this.levelSystem){
			return;
		}

		if(this.tileList.length >= 3){
			console.log("Validate: True");

			var tileCoords: Vector2[] = [];
			for (var i = 0; i < this.tileList.length; i++){
				tileCoords.push(this.tileList[i].GetCoord());
			}

			var tileLength = this.tileList.length;
			this.DeselectAllTile();
			var tileCounter = this.tileCreator.ConsumeTile(tileCoords);
			this.levelSystem.IncrementHealth(-TileSelector.ScoreFunction(tileLength));
		}
		else{
			console.log("Validate: False");
			this.DeselectAllTile();
		}
	}

	public UpdateScoreText(){
		if(!this.tileCreator){
			return;
		}
		if(this.tileList.length < 1){
			return;
		}

		var tile = this.tileList[this.tileList.length-1];
		var gameObject = tile.GetGameObject();

		this.scoreText.setVisible(false);
		if(this.tileList.length >= 3){
			if(tile.GetCoord().x < this.tileCreator.BoardX/2){
				this.scoreText.setPosition(gameObject.x + 35, gameObject.y);
				this.scoreText.setOrigin(0, 0.5);
			}
			else{
				this.scoreText.setPosition(gameObject.x - 35, gameObject.y);
				this.scoreText.setOrigin(1, 0.5);
			}
			this.scoreText.setText(TileSelector.ScoreFunction(this.tileList.length).toString());
			this.scoreText.setVisible(true);
		}
	}

	public GetPrevTile(){
		if(this.tileList.length > 1){
			return this.tileList[this.tileList.length-2];
		}
		return;
	}

	public SetTileCreator(tileCreator: TileCreator){
		this.tileCreator = tileCreator;
	}

	public SetLevelSystem(levelSystem: LevelSystem){
		this.levelSystem = levelSystem;
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
interface TileConnector {
	vertice: Phaser.GameObjects.Ellipse;
	edge: Phaser.GameObjects.Rectangle
}