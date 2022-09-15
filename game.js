"use strict";
window.addEventListener('load', function () {
    var game = new Phaser.Game({
        width: 375,
        height: 587,
        type: Phaser.AUTO,
        backgroundColor: "#242424",
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH
        }
    });
    game.scene.add("Preload", Preload);
    //game.scene.add("Level", Level);
    game.scene.add("MainScene", MainScene);
    game.scene.add("Boot", Boot, true);
});
class Boot extends Phaser.Scene {
    preload() {
        this.load.pack("pack", "assets/preload-asset-pack.json");
    }
    create() {
        this.scene.start("Preload");
    }
}
class UserComponent {
    /**
     * @param gameObject The entity.
     */
    constructor(gameObject) {
        this.scene = gameObject.scene;
        const listenAwake = this.awake !== UserComponent.prototype.awake;
        const listenStart = this.start !== UserComponent.prototype.start;
        const listenUpdate = this.update !== UserComponent.prototype.update;
        const listenDestroy = this.destroy !== UserComponent.prototype.destroy;
        if (listenAwake) {
            this.scene.events.once("scene-awake", this.awake, this);
        }
        if (listenStart) {
            this.scene.events.once(Phaser.Scenes.Events.UPDATE, this.start, this);
        }
        if (listenUpdate) {
            this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
        }
        if (listenStart || listenUpdate || listenDestroy) {
            gameObject.on(Phaser.GameObjects.Events.DESTROY, () => {
                this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.start, this);
                this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this);
                if (listenDestroy) {
                    this.destroy();
                }
            });
        }
    }
    scene;
    awake() {
        // override this
    }
    start() {
        // override this
    }
    update() {
        // override this
    }
    destroy() {
        // override this
    }
}
/// <reference path="./UserComponent.ts"/>
// You can write more code here
/* START OF COMPILED CODE */
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */
class PlayerInput extends UserComponent {
    constructor(gameObject) {
        super(gameObject);
        this.gameObject = gameObject;
        gameObject["__PlayerInput"] = this;
        /* START-USER-CTR-CODE */
        this.input = this.scene.input;
        PlayerInput.Instance = this;
        /* END-USER-CTR-CODE */
    }
    static getComponent(gameObject) {
        return gameObject["__PlayerInput"];
    }
    gameObject;
    /* START-USER-CODE */
    input;
    static Instance;
    tileCreator;
    tileSelector;
    Interaction = false;
    start() {
        this.PrepareInteractionBox();
    }
    PrepareInteractionBox() {
        //console.log("Prepare Interaction " + this.tileCreator + " " + this.tileSelector);
        if (!this.tileCreator) {
            return;
        }
        //console.log("Prepare Interaction Pass");
        var tiles = this.tileCreator.GetAllTiles();
        for (var i = 0; i < tiles.length; i++) {
            for (var j = 0; j < tiles[i].length; j++) {
                var gameObject = tiles[i][j];
                var shape = new Phaser.Geom.Circle(49.5, 44, 44);
                gameObject.setInteractive(shape, Phaser.Geom.Circle.Contains);
            }
        }
    }
    // Static Functions
    static OnPointerDown(pointer, gameObject) {
        return PlayerInput.Instance.OnPointerDown(pointer, gameObject);
    }
    static OnPointerOver(pointer, gameObject) {
        return PlayerInput.Instance.OnPointerOver(pointer, gameObject);
    }
    static OnPointerUp(pointer, gameObject) {
        return PlayerInput.Instance.OnPointerUp(pointer, gameObject);
    }
    static OnPointerOut(pointer, gameObject) {
        return PlayerInput.Instance.OnPointerOut(pointer, gameObject);
    }
    // OnAction Functions
    OnPointerDown(pointer, gameObject) {
        //console.log("Pointer Down " + this.tileCreator + " " + this.tileSelector);
        //console.log(!this.tileCreator || !this.tileSelector);
        if (!this.tileCreator || !this.tileSelector) {
            return;
        }
        //console.log("Pointer Down Pass");
        if (!this.Interaction && Tiles.getComponent(gameObject)) {
            //console.log("Pointer Down Pass");
            this.Interaction = true;
            this.tileSelector.SelectTile(Tiles.getComponent(gameObject));
        }
    }
    OnPointerOver(pointer, gameObject) {
        //console.log("Pointer Over " + this.tileCreator + " " + this.tileSelector);
        //console.log(!this.tileCreator || !this.tileSelector);
        if (!this.tileCreator || !this.tileSelector) {
            return;
        }
        //console.log("Pointer Over Pass");
        if (this.Interaction && Tiles.getComponent(gameObject)) {
            var prevTile = this.tileSelector.GetPrevTile();
            if (prevTile && gameObject == prevTile.GetGameObject()) {
                this.tileSelector.DeselectTile();
            }
            else {
                this.tileSelector.SelectTile(Tiles.getComponent(gameObject));
            }
        }
    }
    OnPointerUp(pointer, gameObject) {
        //console.log("Pointer Up " + this.tileCreator + " " + this.tileSelector);
        //console.log(!this.tileCreator || !this.tileSelector);
        if (!this.tileCreator || !this.tileSelector) {
            return;
        }
        //console.log("Pointer Up Pass");
        if (this.Interaction) {
            this.tileSelector.ValidateSelection();
            this.Interaction = false;
        }
    }
    OnPointerOut(pointer, gameObject) {
        //console.log("Pointer Out");
        //console.log("Pointer Out " + this.tileCreator + " " + this.tileSelector);
        //console.log(!this.tileCreator || !this.tileSelector);
        if (!this.tileCreator || !this.tileSelector) {
            return;
        }
        //console.log("Pointer Out Pass");
    }
    SetTileCreator(tileCreator) {
        this.tileCreator = tileCreator;
        //console.log("Set Tile Creator " + this.tileCreator + " " + this.tileSelector);
    }
    SetTileSelector(tileSelector) {
        this.tileSelector = tileSelector;
        //console.log("Set Tile Selector " + this.tileCreator + " " + this.tileSelector);
    }
}
/* END OF COMPILED CODE */
// You can write more code here
/// <reference path="./UserComponent.ts"/>
/* START OF COMPILED CODE */
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */
class PreloadText extends UserComponent {
    constructor(gameObject) {
        super(gameObject);
        this.gameObject = gameObject;
        gameObject["__PreloadText"] = this;
        /* START-USER-CTR-CODE */
        this.scene.load.on(Phaser.Loader.Events.PROGRESS, (p) => {
            this.gameObject.text = Math.floor(p * 100) + "%";
        });
        /* END-USER-CTR-CODE */
    }
    static getComponent(gameObject) {
        return gameObject["__PreloadText"];
    }
    gameObject;
    /* START-USER-CODE */
    test() {
    }
}
/* END OF COMPILED CODE */
// You can write more code here
/// <reference path="./UserComponent.ts"/>
// You can write more code here
/* START OF COMPILED CODE */
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */
class ScoreSystem extends UserComponent {
    constructor(gameObject) {
        super(gameObject);
        this.gameObject = gameObject;
        gameObject["__ScoreSystem"] = this;
        /* START-USER-CTR-CODE */
        this.CheckLevelUp();
        /* END-USER-CTR-CODE */
    }
    static getComponent(gameObject) {
        return gameObject["__ScoreSystem"];
    }
    gameObject;
    /* START-USER-CODE */
    hpBarText;
    levelText;
    hpBarImage;
    barInitScale = 0;
    maxHp = 0;
    currentHp = 0;
    currentLevel = 0;
    static LevelFunction = function (value) {
        return 10 * Math.pow(2, value) + 20 * Math.pow(2, Math.max(0, value - 4));
    };
    SetHpBarText(hpBarText) {
        this.hpBarText = hpBarText;
        this.CheckLevelUp();
    }
    SetLevelText(levelText) {
        this.levelText = levelText;
        this.CheckLevelUp();
    }
    SetHpBarImage(hpBarImage) {
        this.hpBarImage = hpBarImage;
        this.barInitScale = hpBarImage.scaleX;
        this.CheckLevelUp();
    }
    IncrementHealth(value, relative = true) {
        this.currentHp = Math.max(0, this.currentHp + value);
        this.CheckLevelUp();
        this.UpdateTexts();
    }
    CheckLevelUp() {
        if (this.currentHp <= 0) {
            this.currentLevel += 1;
            this.maxHp = ScoreSystem.LevelFunction(this.currentLevel);
            this.currentHp = this.maxHp;
        }
        this.UpdateTexts();
    }
    UpdateTexts() {
        if (!this.hpBarText || !this.hpBarImage || !this.levelText) {
            return;
        }
        this.hpBarText.setText(this.currentHp + " / " + this.maxHp);
        this.levelText.setText("Level " + this.currentLevel);
        this.hpBarImage.scaleX = (this.currentHp / this.maxHp) * this.barInitScale;
    }
}
/* END OF COMPILED CODE */
// You can write more code here
/// <reference path="./UserComponent.ts"/>
// You can write more code here
/* START OF COMPILED CODE */
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */
class TileCreator extends UserComponent {
    constructor(gameObject) {
        super(gameObject);
        this.gameObject = gameObject;
        gameObject["__TileCreator"] = this;
        /* START-USER-CTR-CODE */
        this.container = this.scene.add.container(0, 0);
        this.container.setName("CreatorContainer");
        /* END-USER-CTR-CODE */
    }
    static getComponent(gameObject) {
        return gameObject["__TileCreator"];
    }
    gameObject;
    /* START-USER-CODE */
    container;
    // Hardcoded for now
    TileWidth = 49.5;
    TileHeight = 44;
    StartX = 80;
    StartY = 175;
    BoardX = 7;
    BoardY = 7;
    tileArray = [];
    awake() {
        this.GenerateTile(this.BoardX, this.BoardY);
    }
    GenerateTile(tileX = 7, tileY = 7) {
        const container = this.container;
        // Generate tiles, Hardcoded for now
        var CurrentX;
        var CurrentY;
        var IncrementX = 0.75 * this.TileWidth;
        var IncrementY = this.TileHeight;
        for (var i = 0; i < tileX; i++) {
            this.tileArray.push([]);
            // Current Position
            CurrentX = this.StartX + (i * IncrementX);
            CurrentY = this.StartY;
            if (i % 2 == 0) {
                CurrentY += 0.5 * IncrementY;
            }
            for (var j = 0; j < tileY; j++) {
                var newTile = this.gameObject.scene.add.image(CurrentX, CurrentY, "");
                newTile.scaleX = 0.5;
                newTile.scaleY = 0.5;
                var tileScript = new Tiles(newTile);
                var index = Math.round(Math.random() * 4);
                tileScript.SetImage(index);
                tileScript.SetCoord({ x: i, y: j });
                container.add(newTile);
                this.tileArray[i].push(newTile);
                CurrentY += IncrementY;
            }
        }
    }
    ConsumeTile(consumedTiles) {
        // Init Counter
        var tileCounter = [];
        var tileImages = [];
        for (var i = 0; i < this.BoardX; i++) {
            tileCounter.push([]);
            tileImages.push([]);
            for (var j = 0; j < this.BoardY; j++) {
                tileCounter[i].push(0);
                tileImages[i].push(0);
            }
        }
        // Mark removed tiles
        for (var i = 0; i < consumedTiles.length; i++) {
            var value = consumedTiles[i];
            tileCounter[value.x][value.y] += 1;
            // for (var j = value.y; j >= 0; j++){
            // 	tileCounter[value.x][j] += 1;
            // }
        }
        // Increment Counters
        for (var i = 0; i < tileCounter.length; i++) {
            for (var j = tileCounter[i].length - 2; j >= 0; j--) {
                tileCounter[i][j] += tileCounter[i][j + 1];
                // if(j != tileCounter[i].length-1){
                // 	tileCounter[i][j] += tileCounter[i][j+1];
                // }
                // if(j - tileCounter[i][j] >= 0){
                // 	var tile = Tiles.getComponent(this.tileArray[i][j]);
                // 	var prevTile = Tiles.getComponent(this.tileArray[i][j - tileCounter[i][j]]);
                // 	tile.SetImage(prevTile.GetImage());
                // }
            }
        }
        // Swap Tile Colors
        for (var i = 0; i < tileCounter.length; i++) {
            for (var j = 0; j < tileCounter[i].length; j++) {
                var tile = Tiles.getComponent(this.tileArray[i][j]);
                if (j + tileCounter[i][j] < tileCounter[i].length) {
                    // var nextTile = Tiles.getComponent(this.tileArray[i][j + tileCounter[i][j]]);
                    tileImages[i][j + tileCounter[i][j]] = tile.GetImage();
                }
                tile.SetImage(tileImages[i][j]);
            }
        }
        // Generate new tiles
        for (var i = 0; i < tileCounter.length; i++) {
            for (var j = 0; j < tileCounter[i][0]; j++) {
                var tile = Tiles.getComponent(this.tileArray[i][j]);
                var index = Math.round(Math.random() * 4);
                tile.SetImage(index);
            }
        }
        return tileCounter;
    }
    GetTile(x, y) {
        if (x < this.tileArray.length) {
            if (y < this.tileArray[x].length) {
                return this.tileArray[x][y];
            }
        }
        return null;
    }
    GetAllTiles() {
        return this.tileArray;
    }
    CheckNeighbor(tile1, tile2) {
        var coord1 = tile1.GetCoord();
        var coord2 = tile2.GetCoord();
        if (!this.CheckTileExist(coord2)) {
            return false;
        }
        for (var i = -1; i <= 1; i++) {
            for (var j = -1; j <= 1; j++) {
                if (i == 0 && j == 0) {
                    continue;
                }
                if (coord1.x % 2 == 0 && i != 0 && j == -1) {
                    continue;
                }
                if (coord1.x % 2 != 0 && i != 0 && j == 1) {
                    continue;
                }
                var newCoord = { x: coord1.x + i, y: coord1.y + j };
                if (coord2.x == newCoord.x && coord2.y == newCoord.y) {
                    return true;
                }
            }
        }
        return false;
    }
    CheckTileExist(tileCoord) {
        if (tileCoord.x >= 0 && tileCoord.x < this.tileArray.length) {
            if (tileCoord.y >= 0 && tileCoord.y < this.tileArray[tileCoord.x].length) {
                return true;
            }
        }
        return false;
    }
}
/* END OF COMPILED CODE */
// You can write more code here
/// <reference path="./UserComponent.ts"/>
// You can write more code here
/* START OF COMPILED CODE */
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */
class TileSelector extends UserComponent {
    constructor(gameObject) {
        super(gameObject);
        this.gameObject = gameObject;
        gameObject["__TileSelector"] = this;
        /* START-USER-CTR-CODE */
        this.container = this.scene.add.container(0, 0);
        this.container.setName("SelectorContainer");
        this.scoreText = this.scene.add.text(0, 0, "");
        this.scoreText.setName("ScoreText");
        this.scoreText.setFontSize(32);
        this.scoreText.setAlign("center");
        this.scoreText.setVisible(false);
        //this.scene.children.moveTo(this.container, 0);
        /* END-USER-CTR-CODE */
    }
    static getComponent(gameObject) {
        return gameObject["__TileSelector"];
    }
    gameObject;
    /* START-USER-CODE */
    container;
    scoreText;
    tileCreator;
    scoreSystem;
    connectors = [];
    tileList = [];
    static ScoreFunction = function (value) {
        return 10 * Math.pow(2, value);
    };
    SelectTile(tile) {
        //console.log("Select Tile");
        if (tile.IsSelected()) {
            return;
        }
        if (!this.tileCreator) {
            return;
        }
        //console.log("Select Tile Pass");
        var prevTile = this.tileList[this.tileList.length - 1];
        if (this.tileList.length > 0 && tile.GetImage() != prevTile.GetImage()) {
            return;
        }
        if (this.tileList.length > 0 && !this.tileCreator.CheckNeighbor(tile, prevTile)) {
            return;
        }
        console.log("Select Tile");
        tile.ToggleSelected(true);
        var gameObject = tile.GetGameObject();
        var ellipse = this.scene.add.ellipse(gameObject.x, gameObject.y, 10, 10);
        var rectangle = this.scene.add.rectangle(gameObject.x, gameObject.y, 0, 4);
        ellipse.isFilled = true;
        rectangle.setOrigin(0, 0.5);
        rectangle.isFilled = true;
        if (this.tileList.length > 0) {
            var prevObj = prevTile.GetGameObject();
            var prevConnector = this.connectors[this.connectors.length - 1];
            var polarCoord = Tiles.ToRadian({ x: gameObject.x - prevObj.x, y: gameObject.y - prevObj.y });
            //console.log(polarCoord.r + " " + polarCoord.angle);
            prevConnector.edge.setSize(polarCoord.r, 4);
            prevConnector.edge.setAngle(polarCoord.angle);
        }
        this.container.add(ellipse);
        this.container.add(rectangle);
        this.tileList.push(tile);
        this.connectors.push({ vertice: ellipse, edge: rectangle });
        this.UpdateScoreText();
    }
    DeselectTile() {
        if (this.tileList.length > 0) {
            console.log("Deselect Tile");
            var tile = this.tileList.pop();
            var connector = this.connectors.pop();
            if (!tile || !connector) {
                return;
            }
            if (this.tileList.length > 0) {
                var prevConnector = this.connectors[this.connectors.length - 1];
                prevConnector.edge.setSize(0, 4);
                prevConnector.edge.setAngle(0);
            }
            tile.ToggleSelected(false);
            connector.vertice.destroy();
            connector.edge.destroy();
            this.UpdateScoreText();
        }
    }
    DeselectAllTile() {
        console.log("Deselect All Tile");
        while (this.tileList.length > 0) {
            this.DeselectTile();
        }
    }
    ValidateSelection() {
        if (!this.tileCreator || !this.scoreSystem) {
            return;
        }
        if (this.tileList.length >= 3) {
            console.log("Validate: True");
            var tileCoords = [];
            for (var i = 0; i < this.tileList.length; i++) {
                tileCoords.push(this.tileList[i].GetCoord());
            }
            var tileLength = this.tileList.length;
            this.DeselectAllTile();
            var tileCounter = this.tileCreator.ConsumeTile(tileCoords);
            this.scoreSystem.IncrementHealth(-TileSelector.ScoreFunction(tileLength));
        }
        else {
            console.log("Validate: False");
            this.DeselectAllTile();
        }
    }
    UpdateScoreText() {
        if (!this.tileCreator) {
            return;
        }
        if (this.tileList.length < 1) {
            return;
        }
        var tile = this.tileList[this.tileList.length - 1];
        var gameObject = tile.GetGameObject();
        this.scoreText.setVisible(false);
        if (this.tileList.length >= 3) {
            if (tile.GetCoord().x < this.tileCreator.BoardX / 2) {
                this.scoreText.setPosition(gameObject.x + 35, gameObject.y);
                this.scoreText.setOrigin(0, 0.5);
            }
            else {
                this.scoreText.setPosition(gameObject.x - 35, gameObject.y);
                this.scoreText.setOrigin(1, 0.5);
            }
            this.scoreText.setText(TileSelector.ScoreFunction(this.tileList.length).toString());
            this.scoreText.setVisible(true);
        }
    }
    GetPrevTile() {
        if (this.tileList.length > 1) {
            return this.tileList[this.tileList.length - 2];
        }
        return;
    }
    SetTileCreator(tileCreator) {
        this.tileCreator = tileCreator;
    }
    SetScoreSystem(scoreSystem) {
        this.scoreSystem = scoreSystem;
    }
}
/// <reference path="./UserComponent.ts"/>
// You can write more code here
/* START OF COMPILED CODE */
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */
class Tiles extends UserComponent {
    constructor(gameObject) {
        super(gameObject);
        this.gameObject = gameObject;
        gameObject["__Tiles"] = this;
        /* START-USER-CTR-CODE */
        // Write your code here.
        /* END-USER-CTR-CODE */
    }
    static getComponent(gameObject) {
        return gameObject["__Tiles"];
    }
    gameObject;
    /* START-USER-CODE */
    static IdleTextures = ["BLUE_1", "GREEN_1", "PURPLE_1", "RED_1", "YELLOW_1"];
    static SelectedTextures = ["BLUE_2", "GREEN_2", "PURPLE_2", "RED_2", "YELLOW_2"];
    coord = { x: -1, y: -1 };
    selected = false;
    textureIndex = 0;
    // Write your code here.
    SetImage(index) {
        this.textureIndex = index;
        this.UpdateTexture();
    }
    GetImage() {
        return this.textureIndex;
    }
    SetCoord(coord) {
        this.coord = coord;
    }
    GetCoord() {
        return this.coord;
    }
    UpdateTexture() {
        if (this.selected) {
            this.gameObject.setTexture(Tiles.SelectedTextures[this.textureIndex]);
        }
        else {
            this.gameObject.setTexture(Tiles.IdleTextures[this.textureIndex]);
        }
    }
    IsSelected() {
        return this.selected;
    }
    ToggleSelected(state) {
        this.selected = state;
        this.UpdateTexture();
    }
    GetGameObject() {
        return this.gameObject;
    }
    static ToRadian(coord) {
        return {
            r: Math.sqrt(Math.pow(coord.x, 2) + Math.pow(coord.y, 2)),
            angle: Math.atan2(coord.y, coord.x) * 180 / Math.PI
        };
    }
}
// You can write more code here
/* START OF COMPILED CODE */
class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");
        /* START-USER-CTR-CODE */
        // Write your code here.
        /* END-USER-CTR-CODE */
    }
    editorCreate() {
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
        level_text.setStyle({ "align": "center", "fontSize": "24px", "fontStyle": "bold" });
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
        // gameManager (components)
        new TileCreator(gameManager);
        new TileSelector(gameManager);
        new ScoreSystem(gameManager);
        new PlayerInput(gameManager);
        this.GameManagerSetup(gameManager);
        this.ScoreSystemSetup(gameManager, hpbar_text, level_text, hpbar_fill);
        this.InputSetup(gameManager);
        this.PrintAll();
        this.events.emit("scene-awake");
    }
    /* START-USER-CODE */
    // this.GameManagerSetup(gameManager);
    // this.ScoreSystemSetup(gameManager, hpbar_text, level_text, hpbar_fill);
    // this.InputSetup(gameManager);
    // this.PrintAll();
    GameManagerSetup(gameManager) {
        //this.children.moveTo(gameManager, 0);
        var tileCreator = TileCreator.getComponent(gameManager);
        var tileSelector = TileSelector.getComponent(gameManager);
        var playerInput = PlayerInput.getComponent(gameManager);
        var scoreSystem = ScoreSystem.getComponent(gameManager);
        //console.log("Game Manager Setup " + tileCreator + " " + tileSelector + " " + playerInput);
        tileSelector.SetTileCreator(tileCreator);
        tileSelector.SetScoreSystem(scoreSystem);
        playerInput.SetTileCreator(tileCreator);
        playerInput.SetTileSelector(tileSelector);
    }
    ScoreSystemSetup(gameManager, hpBarText, levelText, hpBarImage) {
        var scoreSystem = ScoreSystem.getComponent(gameManager);
        scoreSystem.SetHpBarText(hpBarText);
        scoreSystem.SetLevelText(levelText);
        scoreSystem.SetHpBarImage(hpBarImage);
    }
    InputSetup(gameManager) {
        // var playerInput = PlayerInput.getComponent(gameManager);
        // console.log("Input Setup " + playerInput);
        this.input.on("gameobjectover", PlayerInput.OnPointerOver);
        this.input.on("gameobjectout", PlayerInput.OnPointerOut);
        this.input.on("gameobjectdown", PlayerInput.OnPointerDown);
        this.input.on("pointerup", PlayerInput.OnPointerUp);
        this.input.on("pointerupoutside", PlayerInput.OnPointerUp);
    }
    PrintAll() {
        this.children.getAll().forEach(function (value) {
            console.log(value.name);
        });
    }
    create() {
        this.editorCreate();
    }
}
/* END OF COMPILED CODE */
// You can write more code here
// You can write more code here
/* START OF COMPILED CODE */
class Preload extends Phaser.Scene {
    constructor() {
        super("Preload");
        /* START-USER-CTR-CODE */
        // Write your code here.
        /* END-USER-CTR-CODE */
    }
    editorPreload() {
        this.load.pack("asset-pack", "assets/asset-pack.json");
    }
    editorCreate() {
        // guapen
        const guapen = this.add.image(191, 219, "guapen");
        guapen.scaleX = 0.5915891440784282;
        guapen.scaleY = 0.5915891440784282;
        // progress
        const progress = this.add.text(189, 349, "", {});
        progress.setOrigin(0.5, 0.5);
        progress.text = "0%";
        progress.setStyle({ "fontSize": "30px" });
        // progress (components)
        new PreloadText(progress);
        this.events.emit("scene-awake");
    }
    /* START-USER-CODE */
    // Write your code here
    preload() {
        this.editorCreate();
        this.editorPreload();
        this.load.on(Phaser.Loader.Events.COMPLETE, () => this.scene.start("MainScene"));
    }
}
/* END OF COMPILED CODE */
// You can write more code here
