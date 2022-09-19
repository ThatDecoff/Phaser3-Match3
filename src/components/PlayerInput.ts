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
	private animationSystem?: AnimationSystem;

	private interactable: Boolean = true;
	private tileInteraction: Boolean = false;
	private boosterInteraction: Boolean = false;

	private boosterObject?: BoosterBase;

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
		if(!this.tileCreator || !this.tileSelector || !this.animationSystem){
			return;
		}
		if(this.animationSystem.IsAnimationRunning()){
			return;
		}

		if(this.interactable && Tiles.getComponent(gameObject)){
			this.interactable = false;
			this.tileInteraction = true;

			this.tileSelector.SelectTile(Tiles.getComponent(gameObject));
		}

		else if(this.interactable && BoosterBase.getComponent(gameObject)){
			this.interactable = false;
			this.boosterInteraction = true;

			this.boosterObject = BoosterBase.getComponent(gameObject);
			this.boosterObject.OnStandby();
		}
	}

	public OnPointerOver(pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.GameObject){
		if(!this.tileCreator || !this.tileSelector){
			return;
		}

		if(this.tileInteraction && Tiles.getComponent(gameObject)){
			var prevTile = this.tileSelector.GetPrevTile();

			if(prevTile && gameObject == prevTile.GetGameObject()){
				this.tileSelector.DeselectTile();
			}
			else{
				this.tileSelector.SelectTile(Tiles.getComponent(gameObject));
			}
		}
	}

	public OnPointerUp(pointer?: Phaser.Input.Pointer, gameObject?: Phaser.GameObjects.GameObject){
		if(!this.tileCreator || !this.tileSelector){
			return;
		}

		if(this.tileInteraction){
			this.tileSelector.ValidateSelection();

			this.interactable = true;
			this.tileInteraction = false;
		}

		else if(this.boosterInteraction && this.boosterObject){
			this.boosterObject.OnInteract();

			this.interactable = true;
			this.boosterInteraction = false;
		}
	}

	public OnPointerOut(pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.GameObject){
		if(!this.tileCreator || !this.tileSelector){
			return;
		}

		if(this.boosterInteraction && this.boosterObject){
			this.boosterObject.OnCancel();

			this.interactable = true;
			this.boosterInteraction = false;
		}
	}

	public SetTileCreator(tileCreator: TileCreator){
		this.tileCreator = tileCreator;
	}

	public SetTileSelector(tileSelector: TileSelector){
		this.tileSelector = tileSelector;
	}

	public SetAnimationSystem(animationSystem: AnimationSystem){
		this.animationSystem = animationSystem;
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here