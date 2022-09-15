/// <reference path="./UserComponent.ts"/>

// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

class Tiles extends UserComponent {

	constructor(gameObject: Phaser.GameObjects.Image) {
		super(gameObject);

		this.gameObject = gameObject;
		(gameObject as any)["__Tiles"] = this;

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	static getComponent(gameObject: Phaser.GameObjects.GameObject): Tiles {
		return (gameObject as any)["__Tiles"];
	}

	private gameObject: Phaser.GameObjects.Image;

	/* START-USER-CODE */
	static IdleTextures: string[] = ["BLUE_1", "GREEN_1", "PURPLE_1", "RED_1", "YELLOW_1"];
	static SelectedTextures: string[] = ["BLUE_2", "GREEN_2", "PURPLE_2", "RED_2", "YELLOW_2"];

	private coord: Vector2 = {x: -1, y: -1};
	private selected: Boolean = false;
	private textureIndex: number = 0;

	// Write your code here.
	public SetImage(index: number){
		this.textureIndex = index;
		this.UpdateTexture();
	}

	public GetImage(){
		return this.textureIndex;
	}

	public SetCoord(coord: Vector2){
		this.coord = coord;
	}

	public GetCoord(){
		return this.coord;
	}

	public UpdateTexture(){
		if(this.selected){
			this.gameObject.setTexture(Tiles.SelectedTextures[this.textureIndex]);
		}
		else{
			this.gameObject.setTexture(Tiles.IdleTextures[this.textureIndex]);
		}
	}

	public IsSelected(){
		return this.selected;
	}

	public ToggleSelected(state: Boolean){
		this.selected = state;
		this.UpdateTexture();
	}

	public GetGameObject(){
		return this.gameObject;
	}

	static ToRadian(coord: Vector2){
		return {
			r: Math.sqrt(Math.pow(coord.x, 2) + Math.pow(coord.y, 2)),
			angle: Math.atan2(coord.y, coord.x)*180/Math.PI
		}
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
interface Vector2 {
	x: number;
	y: number
}