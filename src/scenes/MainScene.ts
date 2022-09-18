
// You can write more code here

/* START OF COMPILED CODE */

class MainScene extends Phaser.Scene {

	constructor() {
		super("MainScene");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	editorCreate(): void {

		// PowerUpContainer
		const powerUpContainer = this.add.container(0, 0);
		powerUpContainer.name = "PowerUpContainer";

		// hint_booster
		const hint_booster = this.add.image(115, 540, "RAINBOW");
		hint_booster.name = "hint_booster";
		hint_booster.scaleX = 0.4;
		hint_booster.scaleY = 0.4;
		powerUpContainer.add(hint_booster);

		// shuffle_booster
		const shuffle_booster = this.add.image(270, 540, "SHUFFLE");
		shuffle_booster.name = "shuffle_booster";
		shuffle_booster.scaleX = 0.4;
		shuffle_booster.scaleY = 0.4;
		powerUpContainer.add(shuffle_booster);

		// HealthBarContainer
		const healthBarContainer = this.add.container(192, 64);
		healthBarContainer.name = "HealthBarContainer";

		// hpbar_bg
		const hpbar_bg = this.add.image(0, 0, "hpbar_bg");
		hpbar_bg.name = "hpbar_bg";
		hpbar_bg.scaleX = 4;
		hpbar_bg.scaleY = 4;
		healthBarContainer.add(hpbar_bg);

		// hpbar_fill_white
		const hpbar_fill_white = this.add.image(0, 0, "hpbar_fill_white");
		hpbar_fill_white.name = "hpbar_fill_white";
		hpbar_fill_white.scaleX = 4;
		hpbar_fill_white.scaleY = 4;
		healthBarContainer.add(hpbar_fill_white);

		// hpbar_fill
		const hpbar_fill = this.add.image(-150, 0, "hpbar_fill");
		hpbar_fill.name = "hpbar_fill";
		hpbar_fill.scaleX = 4;
		hpbar_fill.scaleY = 4;
		hpbar_fill.setOrigin(0, 0.5);
		healthBarContainer.add(hpbar_fill);

		// hpbar_frame
		const hpbar_frame = this.add.image(0, 0, "hpbar_frame");
		hpbar_frame.name = "hpbar_frame";
		hpbar_frame.scaleX = 4;
		hpbar_frame.scaleY = 4;
		healthBarContainer.add(hpbar_frame);

		// level_text
		const level_text = this.add.text(0, -40, "", {});
		level_text.name = "level_text";
		level_text.setOrigin(0.5, 0.5);
		level_text.text = "Level XX";
		level_text.setStyle({ "align": "center", "color": "#ffffffff", "fontSize": "24px", "fontStyle": "bold", "stroke": "#ffffffff" });
		healthBarContainer.add(level_text);

		// hpbar_text
		const hpbar_text = this.add.text(0, 0, "", {});
		hpbar_text.name = "hpbar_text";
		hpbar_text.setOrigin(0.5, 0.5);
		hpbar_text.text = "XX / XX";
		hpbar_text.setStyle({ "align": "center", "color": "#000000ff", "fontSize": "18px", "fontStyle": "bold" });
		healthBarContainer.add(hpbar_text);

		// GameManager
		const gameManager = this.add.image(0, 0, "_MISSING");
		gameManager.name = "GameManager";
		gameManager.visible = false;

		// hint_booster (components)
		new HintBooster(hint_booster);

		// shuffle_booster (components)
		new ShuffleBooster(shuffle_booster);

		// gameManager (components)
		new TileCreator(gameManager);
		new TileSelector(gameManager);
		new LevelSystem(gameManager);
		new AnimationSystem(gameManager);
		new PlayerInput(gameManager);

		this.GameManagerSetup(gameManager);
		this.LevelSystemSetup(gameManager, hpbar_text, level_text, hpbar_fill);
		this.BoosterSetup(gameManager, hint_booster, shuffle_booster);
		this.AnimationSetup();
		this.InputSetup(gameManager);
		this.events.emit("scene-awake");
	}

	/* START-USER-CODE */

		// this.GameManagerSetup(gameManager);
		// this.LevelSystemSetup(gameManager, hpbar_text, level_text, hpbar_fill);
		// this.BoosterSetup(gameManager, hint_booster, shuffle_booster);
		// this.AnimationSetup();
		// this.InputSetup(gameManager);
		// this.PrintAll();

	private GameManagerSetup(gameManager: Phaser.GameObjects.Image){
		//this.children.moveTo(gameManager, 0);

		var tileCreator = TileCreator.getComponent(gameManager);
		var tileSelector = TileSelector.getComponent(gameManager);
		var levelSystem = LevelSystem.getComponent(gameManager);
		var animationSystem = AnimationSystem.getComponent(gameManager);
		var playerInput = PlayerInput.getComponent(gameManager);

		//console.log("Game Manager Setup " + tileCreator + " " + tileSelector + " " + playerInput);
		tileCreator.SetAnimationSystem(animationSystem);

		tileSelector.SetTileCreator(tileCreator);
		tileSelector.SetLevelSystem(levelSystem);
		tileSelector.SetAnimationSystem(animationSystem);

		playerInput.SetTileCreator(tileCreator);
		playerInput.SetTileSelector(tileSelector);
		playerInput.SetAnimationSystem(animationSystem);

		levelSystem.SetAnimationSystem(animationSystem);
	}

	private LevelSystemSetup(
		gameManager: Phaser.GameObjects.Image,
		hpBarText: Phaser.GameObjects.Text,
		levelText: Phaser.GameObjects.Text,
		hpBarImage: Phaser.GameObjects.Image
	){
		var levelSystem = LevelSystem.getComponent(gameManager);

		levelSystem.SetHpBarText(hpBarText);
		levelSystem.SetLevelText(levelText);
		levelSystem.SetHpBarImage(hpBarImage);
	}

	private BoosterSetup(
		gameManager: Phaser.GameObjects.Image,
		hintBooster: Phaser.GameObjects.Image,
		shuffleBooster: Phaser.GameObjects.Image
	){
		var tileCreator = TileCreator.getComponent(gameManager);
		var tileSelector = TileSelector.getComponent(gameManager);

		var hintBoosterScr = HintBooster.getComponent(hintBooster);
		var shuffleBoosterScr = ShuffleBooster.getComponent(shuffleBooster);

		hintBoosterScr.SetTileCreator(tileCreator);
		hintBoosterScr.SetTileSelector(tileSelector);

		shuffleBoosterScr.SetTileCreator(tileCreator);
		shuffleBoosterScr.SetTileSelector(tileSelector);
	}

	private AnimationSetup(){
		this.anims.create({
			key: "TileFx",
			frames: "tiles_fx",
			repeat: -1
		});

		this.anims.create({
			key: "TileSelect",
			frames: "tiles_select",
			repeat: -1
		});
	}

	private InputSetup(gameManager: Phaser.GameObjects.Image){
		// var playerInput = PlayerInput.getComponent(gameManager);

		// console.log("Input Setup " + playerInput);

		this.input.on("gameobjectover", PlayerInput.OnPointerOver);
		this.input.on("gameobjectout", PlayerInput.OnPointerOut);
		this.input.on("gameobjectdown", PlayerInput.OnPointerDown);

		this.input.on("pointerup", PlayerInput.OnPointerUp);
		this.input.on("pointerupoutside", PlayerInput.OnPointerUp);
	}

	private PrintAll(){
		this.children.getAll().forEach(function (value){
			console.log(value.name);
		});
	}

	create() {

		this.editorCreate();
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
