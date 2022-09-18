/// <reference path="./UserComponent.ts"/>

// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

class AnimationSystem extends UserComponent {

	constructor(gameObject: Phaser.GameObjects.Image) {
		super(gameObject);

		this.gameObject = gameObject;
		(gameObject as any)["__AnimationSystem"] = this;

		/* START-USER-CTR-CODE */
		this.container = this.scene.add.container(0, 0);
		this.container.setName("AnimationContainer");
		this.scene.children.moveTo(this.container, this.scene.children.length-1);
		/* END-USER-CTR-CODE */
	}

	static getComponent(gameObject: Phaser.GameObjects.Image): AnimationSystem {
		return (gameObject as any)["__AnimationSystem"];
	}

	private gameObject: Phaser.GameObjects.Image;

	/* START-USER-CODE */
	private container: Phaser.GameObjects.Container;

	private animationList: BaseAnimObj[] = [];

	override update(time: number, delta: number){
		if(this.animationList.length > 0){
			delta = delta / 1000;
			var finished: BaseAnimObj[] = [];

			for(var i = 0; i < this.animationList.length; i++){
				this.animationList[i].OnUpdate(delta);
				if(this.animationList[i].IsFinished()){
					finished.push(this.animationList[i]);
				}
			}

			for(var i = 0; i < finished.length; i++){
				var index = this.animationList.indexOf(finished[i], 0);
				if(index > -1){
					this.animationList.splice(index, 1);
				}
			}
		}
	}

	public IsAnimationRunning(){
		return (this.animationList.length > 0)
	}

	public AddAnimation(animation: BaseAnimObj){
		this.animationList.push(animation);
		var gameObject = animation.GetGameObject();
		if(gameObject){
			this.container.add(gameObject);
		}
		animation.OnStart();
	}
	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
