/// <reference path="./UserComponent.ts"/>

// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

class PlayerInput extends UserComponent {

	constructor(gameObject: Phaser.GameObjects.Image) {
		super(gameObject);

		this.gameObject = gameObject;
		(gameObject as any)["__PlayerInput"] = this;

		/* START-USER-CTR-CODE */
		this.input = this.scene.input;
		PlayerInput.Instance = this;
		/* END-USER-CTR-CODE */
	}

	static getComponent(gameObject: Phaser.GameObjects.Image): PlayerInput {
		return (gameObject as any)["__PlayerInput"];
	}

	private gameObject: Phaser.GameObjects.Image;

	/* START-USER-CODE */
	private input: Phaser.Input.InputPlugin;

	static Instance: PlayerInput;

	private tileCreator?: TileCreator;
	private tileSelector?: TileSelector;

	private interactable: Boolean = true;
	private tileInteraction: Boolean = false;
	private boosterInteraction: Boolean = false;

	private boosterObject?: BoosterBase;

	override start(){
		// this.PrepareInteractionBox();
	}

	private PrepareInteractionBox(){
		//console.log("Prepare Interaction " + this.tileCreator + " " + this.tileSelector);
		if(!this.tileCreator){
			return;
		}
		//console.log("Prepare Interaction Pass");

		var tiles = this.tileCreator.GetAllTiles();
		for (var i = 0; i < tiles.length; i++){

			for (var j = 0; j < tiles[i].length; j++){
				var gameObject = tiles[i][j] as Phaser.GameObjects.Image;
				var shape = new Phaser.Geom.Circle(49.5, 44, 44);

				gameObject.setInteractive(shape, Phaser.Geom.Circle.Contains);
			}
		}
	}

	// Static Functions
	static OnPointerDown(pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.GameObject){
		return PlayerInput.Instance.OnPointerDown(pointer, gameObject);
	}

	static OnPointerOver(pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.GameObject){
		return PlayerInput.Instance.OnPointerOver(pointer, gameObject);
	}

	static OnPointerUp(pointer?: Phaser.Input.Pointer, gameObject?: Phaser.GameObjects.GameObject){
		return PlayerInput.Instance.OnPointerUp(pointer, gameObject);
	}

	static OnPointerOut(pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.GameObject){
		return PlayerInput.Instance.OnPointerOut(pointer, gameObject);
	}

	// OnAction Functions
	public OnPointerDown(pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.GameObject){
		//console.log("Pointer Down " + this.tileCreator + " " + this.tileSelector);
		//console.log(!this.tileCreator || !this.tileSelector);
		if(!this.tileCreator || !this.tileSelector){
			return;
		}
		// console.log("Pointer Down " + this.interactable + " " + this.tileInteraction + " " + this.boosterInteraction);
		//console.log("Pointer Down Pass");

		if(this.interactable && Tiles.getComponent(gameObject)){
			// console.log("Pointer Down: Tile");
			this.interactable = false;
			this.tileInteraction = true;

			this.tileSelector.SelectTile(Tiles.getComponent(gameObject));
		}

		else if(this.interactable && BoosterBase.getComponent(gameObject)){
			// console.log("Pointer Down: Booster");
			this.interactable = false;
			this.boosterInteraction = true;

			this.boosterObject = BoosterBase.getComponent(gameObject);
			this.boosterObject.OnStandby();
		}
		// console.log("Pointer Down RES " + this.interactable + " " + this.tileInteraction + " " + this.boosterInteraction);
	}

	public OnPointerOver(pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.GameObject){
		//console.log("Pointer Over " + this.tileCreator + " " + this.tileSelector);
		//console.log(!this.tileCreator || !this.tileSelector);
		if(!this.tileCreator || !this.tileSelector){
			return;
		}
		// console.log("Pointer Over " + this.interactable + " " + this.tileInteraction + " " + this.boosterInteraction);
		//console.log("Pointer Over Pass");

		if(this.tileInteraction && Tiles.getComponent(gameObject)){
			// console.log("Pointer Over: Tile");
			var prevTile = this.tileSelector.GetPrevTile();

			if(prevTile && gameObject == prevTile.GetGameObject()){
				this.tileSelector.DeselectTile();
			}
			else{
				this.tileSelector.SelectTile(Tiles.getComponent(gameObject));
			}
		}
		// console.log("Pointer Over RES " + this.interactable + " " + this.tileInteraction + " " + this.boosterInteraction);
	}

	public OnPointerUp(pointer?: Phaser.Input.Pointer, gameObject?: Phaser.GameObjects.GameObject){
		//console.log("Pointer Up " + this.tileCreator + " " + this.tileSelector);
		//console.log(!this.tileCreator || !this.tileSelector);
		if(!this.tileCreator || !this.tileSelector){
			return;
		}
		// console.log("Pointer Up " + this.interactable + " " + this.tileInteraction + " " + this.boosterInteraction);
		//console.log("Pointer Up Pass");

		if(this.tileInteraction){
			// console.log("Pointer Up: Tile");
			this.tileSelector.ValidateSelection();

			this.interactable = true;
			this.tileInteraction = false;
		}

		else if(this.boosterInteraction && this.boosterObject){
			// console.log("Pointer Up: Booster");
			this.boosterObject.OnInteract();
			//this.boosterObject = false;

			this.interactable = true;
			this.boosterInteraction = false;
		}
		// console.log("Pointer Up RES " + this.interactable + " " + this.tileInteraction + " " + this.boosterInteraction);
	}

	public OnPointerOut(pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.GameObject){
		//console.log("Pointer Out");
		//console.log("Pointer Out " + this.tileCreator + " " + this.tileSelector);
		//console.log(!this.tileCreator || !this.tileSelector);
		if(!this.tileCreator || !this.tileSelector){
			return;
		}
		// console.log("Pointer Out " + this.interactable + " " + this.tileInteraction + " " + this.boosterInteraction);
		//console.log("Pointer Out Pass");

		if(this.boosterInteraction && this.boosterObject){
			// console.log("Pointer Out: Booster");
			this.boosterObject.OnCancel();
			//this.boosterObject = false;

			this.interactable = true;
			this.boosterInteraction = false;
		}
		// console.log("Pointer Out RES " + this.interactable + " " + this.tileInteraction + " " + this.boosterInteraction);
	}

	public SetTileCreator(tileCreator: TileCreator){
		this.tileCreator = tileCreator;
		//console.log("Set Tile Creator " + this.tileCreator + " " + this.tileSelector);
	}

	public SetTileSelector(tileSelector: TileSelector){
		this.tileSelector = tileSelector;
		//console.log("Set Tile Selector " + this.tileCreator + " " + this.tileSelector);
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here