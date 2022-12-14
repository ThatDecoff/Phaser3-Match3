/// <reference path="./UserComponent.ts"/>

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

class PreloadText extends UserComponent {

	constructor(gameObject: Phaser.GameObjects.Text) {
		super(gameObject);

		this.gameObject = gameObject;
		(gameObject as any)["__PreloadText"] = this;

		/* START-USER-CTR-CODE */

		this.scene.load.on(Phaser.Loader.Events.PROGRESS, (p: number) => {

			this.gameObject.text = Math.floor(p * 100) + "%";
		});

		/* END-USER-CTR-CODE */
	}

	static getComponent(gameObject: Phaser.GameObjects.Text): PreloadText {
		return (gameObject as any)["__PreloadText"];
	}

	private gameObject: Phaser.GameObjects.Text;

	/* START-USER-CODE */
	private test() {
	}

	// Write your code here.

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
