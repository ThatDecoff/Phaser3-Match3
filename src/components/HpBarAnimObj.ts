class HpBarAnimObj extends BaseAnimObj {
    constructor(
        gameObject: Phaser.GameObjects.Image,
        startVal: number,
        endVal: number,
        levelSystem: LevelSystem
    ){
        super(gameObject as Phaser.GameObjects.GameObject);

        this.gameObject = gameObject;
        this.levelSystem = levelSystem;
        this.startVal = startVal;
        this.endVal = endVal;

        this.speed = endVal - startVal;
    }

    private gameObject: Phaser.GameObjects.Image;

    private levelSystem: LevelSystem;

    private isFinished: boolean = false;

    private startVal: number;
    private endVal: number;

    private speed: number;

    private animationTime: number = 0.6;

    override IsFinished(){
        return this.isFinished;
    }

    override GetGameObject(){
        return null;
    }

    override OnUpdate(delta: number){
        if(!this.isFinished){
            var movement = (this.speed * delta)/this.animationTime;
            this.MoveSnap(movement);
        }
    }

    override OnFinish(){
        this.levelSystem.CheckLevelUp();
    }

    private MoveSnap(movement: number){
        var moveDist = Math.abs(movement);
        var targetDist = Math.abs(this.endVal - this.gameObject.scaleX);
        
        if(moveDist < targetDist){
            // console.log("Move " + this.tilePos.x + " " + this.tilePos.y);
            this.gameObject.setScale(this.gameObject.scaleX + movement,
                this.gameObject.scaleY);
        }
        else{
            // console.log("Snap " + this.tilePos.x + " " + this.tilePos.y);
            this.gameObject.setScale(this.endVal, this.gameObject.scaleY);
            this.OnFinish();
            this.isFinished = true;
        }
    }
}