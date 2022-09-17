/// <reference path="./UserComponent.ts"/>

// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

class BoosterBase extends UserComponent {

	constructor(gameObject: Phaser.GameObjects.Image) {
		super(gameObject);

		this.gameObject = gameObject;
		(gameObject as any)["__BoosterBase"] = this;

		/* START-USER-CTR-CODE */
		this.SetInteractive();
		/* END-USER-CTR-CODE */
	}

	static getComponent(gameObject: Phaser.GameObjects.GameObject): BoosterBase {
		return (gameObject as any)["__BoosterBase"];
	}

	protected gameObject: Phaser.GameObjects.Image;

	/* START-USER-CODE */
	protected SetInteractive(){
		var shape = new Phaser.Geom.Circle(75, 60, 37.5);
		this.gameObject.setInteractive(shape, Phaser.Geom.Circle.Contains);

		// var graphics = this.scene.add.graphics({ x: this.gameObject.x - this.gameObject.displayOriginX, y: this.gameObject.y - this.gameObject.displayOriginY });
    	// graphics.lineStyle(2, 0x00aa00);
		// graphics.strokeCircle(75, 60, 37.5);
	}

	public OnStandby(message?: any){
		// Override
		//console.log("BoosterBase: Standby");
	}

	public OnInteract(message?: any){
		// Override
		//console.log("BoosterBase: Interact");
	}

	public OnCancel(message?: any){
		// Override
		//console.log("BoosterBase: Cancel");
	}

	static shuffle<T>(array: T[]){
		var currentIndex = array.length;

		while(currentIndex > 0){
			var randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;

			[array[currentIndex], array[randomIndex]] = [
				array[randomIndex], array[currentIndex]];
		}
		return array;
	}
	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
