/// <reference path="./UserComponent.ts"/>

// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

class SoundSystem extends UserComponent {

	constructor(gameObject: Phaser.GameObjects.Image) {
		super(gameObject);

		this.gameObject = gameObject;
		(gameObject as any)["__SoundSystem"] = this;

		/* START-USER-CTR-CODE */
		var mainLoop = this.scene.sound.add("main_loop", {loop: true});

		var tileSelect = this.scene.sound.add("tile_select", {volume: 0.2});
		var tileCollect = this.scene.sound.add("tile_collect", {volume: 0.2});
		var tileDown = this.scene.sound.add("tile_down", {volume: 0.2});
		var levelUp = this.scene.sound.add("level_up", {volume: 0.2});

		this.soundCollection["main_loop"] = mainLoop;
		this.soundCollection["tile_select"] = tileSelect;
		this.soundCollection["tile_collect"] = tileCollect;
		this.soundCollection["tile_down"] = tileDown;
		this.soundCollection["level_up"] = levelUp;
		/* END-USER-CTR-CODE */
	}

	static getComponent(gameObject: Phaser.GameObjects.Image): SoundSystem {
		return (gameObject as any)["__SoundSystem"];
	}

	private gameObject: Phaser.GameObjects.Image;

	/* START-USER-CODE */
	private soundCollection: { [key: string] : Phaser.Sound.BaseSound } = {};

	public PlaySound(key: string){
		if(this.soundCollection[key]){
			this.soundCollection[key].play();
		}
	}
	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
