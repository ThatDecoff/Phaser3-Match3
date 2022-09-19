/// <reference path="./UserComponent.ts"/>

// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

class LevelSystem extends UserComponent {

	constructor(gameObject: Phaser.GameObjects.Image) {
		super(gameObject);

		this.gameObject = gameObject;
		(gameObject as any)["__LevelSystem"] = this;

		/* START-USER-CTR-CODE */
		this.currentLevel = 1;
		this.maxHp = LevelSystem.LevelFunction(this.currentLevel);
		this.currentHp = this.maxHp;
		this.InitData();
		/* END-USER-CTR-CODE */
	}

	static getComponent(gameObject: Phaser.GameObjects.Image): LevelSystem {
		return (gameObject as any)["__LevelSystem"];
	}

	private gameObject: Phaser.GameObjects.Image;

	/* START-USER-CODE */
	private animationSystem?: AnimationSystem;
	private soundSystem?: SoundSystem;

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
		this.InitData();
	}

	public SetLevelText(levelText: Phaser.GameObjects.Text){
		this.levelText = levelText;
		this.InitData();
	}

	public SetHpBarImage(hpBarImage: Phaser.GameObjects.Image){
		this.hpBarImage = hpBarImage;
		this.barInitScale = hpBarImage.scaleX;
		this.InitData();
	}

	public SetHealth(value: number, relative: Boolean = true){
		var prevHp = this.currentHp;
		if(relative){
			this.currentHp = Math.max(0, this.currentHp + value);
		}
		else{
			this.currentHp = Math.max(0, value);
		}
		
		this.HpBarAnimation(prevHp);
		if(!this.animationSystem){
			this.CheckLevelUp();
		}
		this.UpdateTexts();
	}

	public CheckLevelUp(){
		if(this.currentHp <= 0){
			this.currentLevel += 1;

			this.maxHp = LevelSystem.LevelFunction(this.currentLevel);
			this.currentHp = this.maxHp;

			if(this.soundSystem){
				this.soundSystem.PlaySound("level_up");
			}

			this.HpBarAnimation(0);
			this.UpdateTexts();
		}
	}

	public HpBarAnimation(prevHp: number){
		if(!this.hpBarImage){
			return;
		}

		if(this.animationSystem){
			if(this.currentHp - prevHp == 0){
				return;
			}

			var animation = new HpBarAnimObj(
				this.hpBarImage,
				(prevHp / this.maxHp) * this.barInitScale,
				(this.currentHp / this.maxHp) * this.barInitScale,
				this
			);
			this.animationSystem.AddAnimation(animation);
		}
		else{
			this.hpBarImage.scaleX = (this.currentHp / this.maxHp) * this.barInitScale;
		}
	}

	public UpdateTexts(){
		if(!this.hpBarText || !this.hpBarImage || !this.levelText){
			return;
		}

		this.hpBarText.setText(this.currentHp + " / " + this.maxHp);
		this.levelText.setText("Level " + this.currentLevel);
	}

	private InitData(){
		if(!this.hpBarText || !this.hpBarImage || !this.levelText){
			return;
		}

		this.hpBarText.setText(this.currentHp + " / " + this.maxHp);
		this.levelText.setText("Level " + this.currentLevel);
		this.hpBarImage.scaleX = (this.currentHp / this.maxHp) * this.barInitScale;
	}

	public SetAnimationSystem(animationSystem: AnimationSystem){
		this.animationSystem = animationSystem;
	}

	public SetSoundSystem(soundSystem: SoundSystem){
		this.soundSystem = soundSystem;
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
