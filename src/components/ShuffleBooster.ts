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
		// console.log("ShuffleBooster: Standby");
		this.SetStandby(true);
	}

	override OnInteract(message?: any){
		if(this.cooldown > 0){
			return;
		}
		// console.log("ShuffleBooster: Interact");

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
		// var randomAmount = 1;
		for(var i = 0; i < randomAmount; i++){
			var tile1 = randomTileList.pop();
			var tile2 = randomTileList.pop();

			if(!tile1 || !tile2){
				break;
			}

			result.push([tile1, tile2]);
		}

		// console.log("Shuffle Booster, Array Length = " + result.length);
		// for(var i = 0; i < result.length; i++){
		// 	console.log("Tile1: " + i + " " + result[i][0].x + ";" + result[i][0].y + " C: " + this.tileCreator.GetTileImage(result[i][0]));
		// 	console.log("Tile2: " + i + " " + result[i][1].x + ";" + result[i][1].y + " C: " + this.tileCreator.GetTileImage(result[i][1]));
		// }

		this.tileCreator.SwapTiles(result);
	}

	override OnCancel(message?: any){
		// console.log("ShuffleBooster: Cancel");
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
