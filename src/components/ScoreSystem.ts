/// <reference path="./UserComponent.ts"/>

// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

class ScoreSystem extends UserComponent {

	constructor(gameObject: Phaser.GameObjects.Image) {
		super(gameObject);

		this.gameObject = gameObject;
		(gameObject as any)["__ScoreSystem"] = this;

		/* START-USER-CTR-CODE */
		this.CheckLevelUp();
		/* END-USER-CTR-CODE */
	}

	static getComponent(gameObject: Phaser.GameObjects.Image): ScoreSystem {
		return (gameObject as any)["__ScoreSystem"];
	}

	private gameObject: Phaser.GameObjects.Image;

	/* START-USER-CODE */
	private hpBarText?: Phaser.GameObjects.Text;
	private levelText?: Phaser.GameObjects.Text;
	private hpBarImage?: Phaser.GameObjects.Image;

	private barInitScale: number = 0;
	private maxHp: number = 0;
	private currentHp: number = 0;
	private currentLevel = 0;

	static LevelFunction = function (value: number){
		return 10 * Math.pow(2, value) + 20 * Math.pow(2, Math.max(0, value - 4));
	};

	public SetHpBarText(hpBarText: Phaser.GameObjects.Text){
		this.hpBarText = hpBarText;
		this.CheckLevelUp();
	}

	public SetLevelText(levelText: Phaser.GameObjects.Text){
		this.levelText = levelText;
		this.CheckLevelUp();
	}

	public SetHpBarImage(hpBarImage: Phaser.GameObjects.Image){
		this.hpBarImage = hpBarImage;
		this.barInitScale = hpBarImage.scaleX;
		this.CheckLevelUp();
	}

	public IncrementHealth(value: number, relative: Boolean = true){
		this.currentHp = Math.max(0, this.currentHp + value);
		this.CheckLevelUp();

		this.UpdateTexts();
	}

	public CheckLevelUp(){
		if(this.currentHp <= 0){
			this.currentLevel += 1;

			this.maxHp = ScoreSystem.LevelFunction(this.currentLevel);
			this.currentHp = this.maxHp;
		}

		this.UpdateTexts();
	}

	public UpdateTexts(){
		if(!this.hpBarText || !this.hpBarImage || !this.levelText){
			return;
		}

		this.hpBarText.setText(this.currentHp + " / " + this.maxHp);
		this.levelText.setText("Level " + this.currentLevel);
		this.hpBarImage.scaleX = (this.currentHp / this.maxHp) * this.barInitScale;
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
