class TileCollectAnimObj extends BaseAnimObj {
    constructor(
        gameObject: Phaser.GameObjects.Container,
        startPos: Vector2,
        endPos: Vector2,
        tileSelector: TileSelector,
        tileCreator: TileCreator
    ){
        super(gameObject as Phaser.GameObjects.GameObject);

        this.gameObject = gameObject;
        this.startPos = startPos;
        this.endPos = endPos;
        this.tileSelector = tileSelector;
        this.tileCreator = tileCreator;

        this.isFinished = false;

        var distance = {
            x: (endPos.x - startPos.x)*-1/20,
            y: (endPos.y - startPos.y)*-1/20
        };
        var lenDistance = Math.sqrt(Math.pow(distance.x, 2) +
            Math.pow(distance.y, 2));

        this.target = {x: startPos.x + distance.x, y: startPos.y + distance.y};
        this.moveDir = {x: distance.x / lenDistance, y: distance.y / lenDistance};
        
        this.speed = lenDistance;
        this.scaleSpeed = gameObject.scaleX * 0.4;
    }

    private gameObject: Phaser.GameObjects.Container;

    private startPos: Vector2;
    private endPos: Vector2;

    private tileSelector: TileSelector;
    private tileCreator: TileCreator;

    private isFinished: boolean;

    private phase: number = 0;
    private target: Vector2;
    private moveDir: Vector2 = {x: 0, y: 0};

    private speed: number = 0;
    private scaleSpeed: number = 0;

    private multiplier: number = 1;
    private useMultiplier: boolean = false;

    private phase1Time: number = 0.1;
    private phase2Time: number = 0.9;

    private print = 0;

    override IsFinished(){
        return this.isFinished;
    }

    override OnUpdate(delta: number){
        if(!this.isFinished){
            if(this.phase == 0){
                var movement: Vector2 = {
                    x: (this.moveDir.x * this.speed * delta)/this.phase1Time,
                    y: (this.moveDir.y * this.speed * delta)/this.phase1Time
                };
                var scale: Vector2 = {
                    x: (this.scaleSpeed * delta)/this.phase1Time,
                    y: (this.scaleSpeed * delta)/this.phase1Time
                }
                this.Phase1Movement(movement, scale);
            }
            else if(this.phase == 1){
                var movement: Vector2 = {
                    x: (this.moveDir.x * this.speed * this.multiplier * delta)/this.phase2Time,
                    y: (this.moveDir.y * this.speed * this.multiplier * delta)/this.phase2Time
                };
                var scale: Vector2 = {
                    x: (this.scaleSpeed * delta)/this.phase2Time,
                    y: (this.scaleSpeed * delta)/this.phase2Time
                }
                this.Phase2Movement(movement, scale);
                if(this.useMultiplier){
                    this.multiplier += (delta/this.phase2Time);
                }
            }
        }
        this.print += 1;
    }

    override OnFinish(){
        this.tileSelector.DecrementCounter();
        this.gameObject.destroy();
    }

    public SetMultiplier(value: number, useMultiplier: boolean = true){
        this.useMultiplier = useMultiplier;
        this.multiplier = value;
    }

    private Phase1Movement(movement: Vector2, scale: Vector2){
        var targetDist = Math.abs(this.target.x - this.gameObject.x) +
            Math.abs(this.target.y - this.gameObject.y);
        var moveDist = Math.abs(movement.x) +
            Math.abs(movement.y);
        
        if(moveDist < targetDist){
            this.gameObject.setPosition(movement.x + this.gameObject.x,
                movement.y + this.gameObject.y);
            this.gameObject.setScale(scale.x + this.gameObject.scaleX,
                scale.y + this.gameObject.scaleY);
        }
        else{
            this.gameObject.setPosition(this.target.x, this.target.y);
            this.gameObject.setScale(scale.x + this.gameObject.scaleX,
                scale.y + this.gameObject.scaleY);
            
            var distance = {
                x: this.endPos.x - this.gameObject.x,
                y: this.endPos.y - this.gameObject.y
            };
            var lenDistance = Math.sqrt(Math.pow(distance.x, 2) +
                Math.pow(distance.y, 2));

            this.target = {x: distance.x, y: distance.y};
            this.moveDir = {x: distance.x / lenDistance, y: distance.y / lenDistance};
            
            this.speed = lenDistance;
            this.scaleSpeed = -1 * this.gameObject.scaleX * 0.5;
            this.SetMultiplier(0.5);

            this.phase += 1;
        }
    }

    private Phase2Movement(movement: Vector2, scale: Vector2){
        var targetDist = Math.abs(this.endPos.x - this.gameObject.x) +
            Math.abs(this.endPos.y - this.gameObject.y);
        var moveDist = Math.abs(movement.x) +
            Math.abs(movement.y);
        
        if(moveDist < targetDist){
            this.gameObject.setPosition(movement.x + this.gameObject.x,
                movement.y + this.gameObject.y);
            this.gameObject.setScale(scale.x + this.gameObject.scaleX,
                scale.y + this.gameObject.scaleY);
        }
        else{
            this.gameObject.setPosition(this.endPos.x, this.endPos.y);
            this.OnFinish();
            this.isFinished = true;
        }
    }
}