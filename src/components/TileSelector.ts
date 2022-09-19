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
		this.scoreText.setColor("#ff0000ff");
		this.scoreText.setStroke("#000000ff", 5);
		this.scoreText.setAlign("center");
		this.scoreText.setFontStyle("bold");
		this.scoreText.setVisible(false);
		// this.scoreText.setStyle({ "align": "center", "color": "#ff0000ff", "fontSize": "32px", "fontStyle": "bold", "stroke": "#000000ff", "strokeThickness":5});
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
	private animationSystem?: AnimationSystem;
	private soundSystem?: SoundSystem;

	private connectors: TileConnector[] = [];
	private tileList: Tiles[] = [];

	private tileCounter = 0;

	static ScoreFunction = function(value: number){
		return 10 * Math.pow(2, value);
	};

	public SelectTile(tile: Tiles, playerInput: boolean = true){
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

		if(playerInput && this.soundSystem){
			this.soundSystem.PlaySound("tile_select");
		}

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

		var tileFx = this.scene.add.sprite(gameObject.x, gameObject.y, "");
		tileFx.setOrigin(0.5, 0.5);
		tileFx.setScale(0.5, 0.5);

		this.container.add(ellipse);
		this.container.add(rectangle);
		this.container.add(tileFx);

		this.tileList.push(tile);
		this.connectors.push({tile: gameObject, vertice: ellipse,
		edge: rectangle, tileFx: tileFx});

		this.UpdateTileEffects();
		this.UpdateScoreText();
	}

	public DeselectTile(playerInput: boolean = true){
		if(this.tileList.length > 0){
			// console.log("Deselect Tile");
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

			if(playerInput && this.soundSystem){
				this.soundSystem.PlaySound("tile_select");
			}

			tile.ToggleSelected(false);
			connector.vertice.destroy();
			connector.edge.destroy();
			connector.tileFx.destroy();

			this.UpdateTileEffects();
			this.UpdateScoreText();
		}
	}

	public DeselectAllTile(playerInput: boolean = true){
		// console.log("Deselect All Tile");
		while(this.tileList.length > 0){
			this.DeselectTile(playerInput);
		}
	}

	public ValidateSelection(){
		if(!this.tileCreator){
			return;
		}

		if(this.tileList.length >= 3){
			// console.log("Validate: True");
			this.tileCounter = this.tileList.length;

			if(this.soundSystem){
				this.soundSystem.PlaySound("tile_collect");
			}

			if(this.animationSystem){
				for (var i = 0; i < this.tileList.length; i++){
					var tile = this.tileList[i];
					var tileObj = tile.GetGameObject();

					var newContainer = this.scene.add.container(tileObj.x, tileObj.y);
					
					var newTile = this.tileCreator.CreateTile(
						{x: 0, y: 0},
						tile.GetImage(), true
					)
					newContainer.add(newTile);

					var tileFx = this.scene.add.sprite(newTile.x, newTile.y, "");
					tileFx.setOrigin(0.5, 0.5);
					tileFx.setScale(0.5, 0.5);
					tileFx.anims.play("TileFx");
					tileFx.setPosition(-2, 1);
					newContainer.add(tileFx);

					if(i == this.tileList.length - 1){
						var newScoreText = this.scene.add.text(0, 0,
							TileSelector.ScoreFunction(this.tileList.length).toString());
						if(tile.GetCoord().x < this.tileCreator.BoardX/2){
							newScoreText.setPosition(35, 0);
							newScoreText.setOrigin(0, 0.5);
						}
						else{
							newScoreText.setPosition(-35, 0);
							newScoreText.setOrigin(1, 0.5);
						}
						newScoreText.setFontSize(32);
						newScoreText.setColor("#ff0000ff");
						newScoreText.setStroke("#000000ff", 5);
						newScoreText.setAlign("center");
						newScoreText.setFontStyle("bold");
						newScoreText.setVisible(true);
						newContainer.add(newScoreText);
					}

					var animation = new TileCollectAnimObj(
						newContainer,
						{x: newContainer.x, y: newContainer.y},
						{x: 192, y: 110},
						this, this.tileCreator
					);
					this.animationSystem.AddAnimation(animation);

					var connector = this.connectors[i];
					connector.tile.setVisible(false);
					connector.vertice.setVisible(false);
					connector.edge.setVisible(false);
					connector.tileFx.setVisible(false);
					this.scoreText.setVisible(false);
				}
			}
			else{
				this.ValidationStart();
			}
			
		}
		else{
			// console.log("Validate: False");
			this.DeselectAllTile(false);
		}
	}

	public DecrementCounter(){
		this.tileCounter -= 1;
		if(this.tileCounter == 0){
			if(this.soundSystem){
				this.soundSystem.PlaySound("tile_collect");
			}

			this.ValidationStart();
		}
	}

	public ValidationStart(){
		if(!this.tileCreator || !this.levelSystem){
			return;
		}

		var tileCoords: Vector2[] = [];
		for (var i = 0; i < this.tileList.length; i++){
			tileCoords.push(this.tileList[i].GetCoord());
		}

		var tileLength = this.tileList.length;
		this.DeselectAllTile(false);
		this.tileCreator.ConsumeTile(tileCoords);
		this.levelSystem.SetHealth(-TileSelector.ScoreFunction(tileLength));
	}

	public UpdateTileEffects(){
		var valid = false;
		if(this.tileList.length >= 3){
			valid = true;
		}

		for(var i = 0; i < this.connectors.length; i++){
			var tileFx = this.connectors[i].tileFx;
			var tile = this.connectors[i].tile;

			if(valid){
				tileFx.anims.play("TileFx");
				tileFx.setPosition(tile.x-2, tile.y+1);
			}
			else{
				tileFx.anims.play("TileSelect");
				tileFx.setPosition(tile.x, tile.y);
			}
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
interface TileConnector {
	tile: Phaser.GameObjects.Image;
	vertice: Phaser.GameObjects.Ellipse;
	edge: Phaser.GameObjects.Rectangle;
	tileFx: Phaser.GameObjects.Sprite
}