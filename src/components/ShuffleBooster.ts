/// <reference path="./BoosterBase.ts"/>

// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

class ShuffleBooster extends BoosterBase {

	constructor(gameObject: Phaser.GameObjects.Image) {
		super(gameObject);

		this.gameObject = gameObject;
		(gameObject as any)["__ShuffleBooster"] = this;

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	static getComponent(gameObject: Phaser.GameObjects.Image): ShuffleBooster {
		return (gameObject as any)["__ShuffleBooster"];
	}

	// private gameObject: Phaser.GameObjects.Image;

	/* START-USER-CODE */
	static IdleTexture: string = "SHUFFLE";
	static StandbyTexture: string = "SHUFFLE_on";
	static DisableTexture: string = "SHUFFLE_off";

	private tileCreator?: TileCreator;
	private tileSelector?: TileSelector;

	private standby: Boolean = false;
	private cooldown: number = 0;

	override update(time: number, delta: number){
		if(this.cooldown > 0){
			delta = delta / 1000;
			this.cooldown -= delta;
		}
		if(this.cooldown <= 0){
			this.UpdateTexture();
		}
	}

	override OnStandby(message?: any){
		if(this.cooldown > 0){
			return;
		}
		this.SetStandby(true);
	}

	override OnInteract(message?: any){
		if(this.cooldown > 0){
			return;
		}

		this.SetStandby(false);
		this.SetCooldown(3);

		if(!this.tileCreator){
			return;
		}

		var boardSize = this.tileCreator.GetBoardSize();
		var randomTileList: Vector2[] = [];

		for(var i = 0; i < boardSize.x; i++){
			for(var j = 0; j < boardSize.y; j++){
				randomTileList.push({x: i, y:j});
			}
		}
		randomTileList = BoosterBase.shuffle<Vector2>(randomTileList);

		var result: [Vector2, Vector2][] = [];

		var randomAmount = Math.floor(Math.random()*5)+12;
		for(var i = 0; i < randomAmount; i++){
			var tile1 = randomTileList.pop();
			var tile2 = randomTileList.pop();

			if(!tile1 || !tile2){
				break;
			}

			result.push([tile1, tile2]);
		}
		this.tileCreator.SwapTiles(result);
	}

	override OnCancel(message?: any){
		this.SetStandby(false);
	}

	public SetCooldown(value: number){
		this.cooldown = value;
		this.UpdateTexture();
	}

	public SetStandby(value: Boolean){
		this.standby = value;
		this.UpdateTexture();
	}

	public UpdateTexture(){
		if(this.cooldown > 0){
			this.gameObject.setTexture(ShuffleBooster.DisableTexture);
		}
		else if(this.standby){
			this.gameObject.setTexture(ShuffleBooster.StandbyTexture);
		}
		else{
			this.gameObject.setTexture(ShuffleBooster.IdleTexture);
		}
	}

	public SetTileCreator(tileCreator: TileCreator){
		this.tileCreator = tileCreator;
	}

	public SetTileSelector(tileSelector: TileSelector){
		this.tileSelector = tileSelector;
	}
	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
