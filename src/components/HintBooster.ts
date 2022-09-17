/// <reference path="./BoosterBase.ts"/>

// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

class HintBooster extends BoosterBase {

	constructor(gameObject: Phaser.GameObjects.Image) {
		super(gameObject);

		this.gameObject = gameObject;
		(gameObject as any)["__HintBooster"] = this;

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	static getComponent(gameObject: Phaser.GameObjects.Image): HintBooster {
		return (gameObject as any)["__HintBooster"];
	}

	// private gameObject: Phaser.GameObjects.Image;

	/* START-USER-CODE */
	static IdleTexture: string = "RAINBOW";
	static StandbyTexture: string = "RAINBOW_on";
	static DisableTexture: string = "RAINBOW_off";

	private tileCreator?: TileCreator;
	private tileSelector?: TileSelector;

	private standby: Boolean = false;
	private cooldown: number = 0;

	override update(time: number, delta: number){
		if(this.cooldown > 0){
			delta = delta / 1000;
			this.cooldown -= delta;
			// console.log(this.cooldown + " " + delta);
		}
		if(this.cooldown <= 0){
			this.UpdateTexture();
		}
	}

	override OnStandby(message?: any){
		if(this.cooldown > 0){
			return;
		}
		console.log("HintBooster: Standby");
		this.SetStandby(true);
	}

	override OnInteract(message?: any){
		if(this.cooldown > 0){
			return;
		}
		console.log("HintBooster: Interact");

		this.SetStandby(false);
		this.SetCooldown(5);

		if(!this.tileCreator || !this.tileSelector){
			return;
		}

		var boardSize = this.tileCreator.GetBoardSize();
		var visitedList: Boolean[][] = [];
		var randomTileList: Vector2[] = [];

		for(var i = 0; i < boardSize.x; i++){
			visitedList.push([]);
			for(var j = 0; j < boardSize.y; j++){
				randomTileList.push({x: i, y:j});
				visitedList[i].push(false);
			}
		}
		randomTileList = BoosterBase.shuffle<Vector2>(randomTileList);

		// Random start vertex for search
		var result: Vector2[] = [];
		var endSearch = false;
		while(randomTileList.length > 0){
			result = [];
			var color = -1;

			var stack: Vector2[] = [];
			var startTile = randomTileList.pop();
			if(startTile){
				stack.push(startTile);
			}

			// Random DFS
			while(stack.length > 0){
				var vertex = stack.pop();
				if(!vertex){
					break;
				}

				visitedList[vertex.x][vertex.y] = true;
				result.push(vertex);
				
				color = this.tileCreator.GetTileImage(vertex);
				endSearch = true;

				var neighbors = this.tileCreator.GetTileNeighbors(vertex);
				neighbors = BoosterBase.shuffle(neighbors);
				for(var i = 0; i < neighbors.length; i++){
					var neighbor = neighbors[i];
					var neighborColor = this.tileCreator.GetTileImage(neighbor);
					if(!visitedList[neighbor.x][neighbor.y] && neighborColor == color){
						stack.push(neighbor);
						endSearch = false;
					}
				}

				// Check for length, if satisfied done
				if(endSearch){
					if(result.length >= 3){
						break;
					}
					else{
						var tile = result.pop();
						if(tile){
							visitedList[tile.x][tile.y] = false;
						}
						endSearch = false;
					}
				}
			}
			if(endSearch){
				break;
			}
		}

		// Search result query
		console.log("Hint Booster, Array Length = " + result.length);
		for(var i = 0; i < result.length; i++){
			console.log("Result: " + i + " " + result[i].x + ";" + result[i].y + " C: " + this.tileCreator.GetTileImage(result[i]));
		}

		if(result.length >= 3){
			for(var i = 0; i < result.length; i++){
				var resTileScript = this.tileCreator.GetTileScript(result[i]);
				if(resTileScript){
					this.tileSelector.SelectTile(resTileScript);
				}
			}
			this.tileSelector.ValidateSelection();
		}
	}

	override OnCancel(message?: any){
		console.log("HintBooster: Cancel");
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
			this.gameObject.setTexture(HintBooster.DisableTexture);
		}
		else if(this.standby){
			this.gameObject.setTexture(HintBooster.StandbyTexture);
		}
		else{
			this.gameObject.setTexture(HintBooster.IdleTexture);
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
