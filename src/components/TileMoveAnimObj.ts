class TileMoveAnimObj extends BaseAnimObj {
    constructor(
        gameObject: Phaser.GameObjects.Image,
        tilePos: Vector2,
        startPos: Vector2,
        endPos: Vector2,
        tileCreator: TileCreator
    ){
        super(gameObject as Phaser.GameObjects.GameObject);

        this.gameObject = gameObject;
        this.tilePos = tilePos;
        this.startPos = startPos;
        this.endPos = endPos;
        this.tileCreator = tileCreator;

        this.isFinished = false;

        var distance = {
            x: endPos.x - startPos.x,
            y: endPos.y - startPos.y
        };
        var lenDistance = Math.sqrt(Math.pow(distance.x, 2) +
            Math.pow(distance.y, 2));

        this.moveDir = {x: distance.x / lenDistance, y: distance.y / lenDistance};
        this.speed = lenDistance;
    }

    private gameObject: Phaser.GameObjects.Image;
    private tilePos: Vector2;

    private startPos: Vector2;
    private endPos: Vector2;

    private tileCreator: TileCreator;

    private isFinished: boolean;

    private moveDir: Vector2 = {x: 0, y: 0};
    private speed: number = 0;

    private multiplier: number = 1;
    private useMultiplier: boolean = false;

    private animationTime: number = 1;

    override IsFinished(){
        return this.isFinished;
    }

    override OnStart(){
        this.tileCreator.SetTileVisibility(this.tilePos, false);
    }

    override OnUpdate(delta: number){
        if(!this.isFinished){
            var movement = {
                x: (this.moveDir.x * this.speed * this.multiplier * delta)/this.animationTime,
                y: (this.moveDir.y * this.speed * this.multiplier * delta)/this.animationTime
            };
            this.MoveSnap(movement);
            if(this.useMultiplier){
                this.multiplier += (delta/this.animationTime);
            }
        }
    }

    override OnFinish(){
        this.tileCreator.SetTileVisibility(this.tilePos, true);
        this.gameObject.destroy();
    }

    public SetMultiplier(value: number, useMultiplier: boolean = true){
        this.useMultiplier = useMultiplier;
        this.multiplier = value;
    }

    private MoveSnap(movement: Vector2){
        var targetDist = Math.abs(this.endPos.x - this.gameObject.x) +
            Math.abs(this.endPos.y - this.gameObject.y);
        var moveDist = Math.abs(movement.x) +
            Math.abs(movement.y);
        
        if(moveDist < targetDist){
            this.gameObject.setPosition(movement.x + this.gameObject.x,
                movement.y + this.gameObject.y);
        }
        else{
            this.gameObject.setPosition(this.endPos.x, this.endPos.y);
            this.OnFinish();
            this.isFinished = true;
        }
    }
}