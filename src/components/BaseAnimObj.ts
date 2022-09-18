class BaseAnimObj {
    constructor(gameObject: Phaser.GameObjects.GameObject){
        this.baseGameObject = gameObject;
    }

    private baseGameObject: Phaser.GameObjects.GameObject;

    public GetGameObject(): (Phaser.GameObjects.GameObject | null){
        return this.baseGameObject;
    }

    public IsFinished(): boolean{
        return false;
    }

    public OnStart(){
        // Override
    }

    public OnUpdate(delta: number){
        // Override
    }

    public OnFinish(){
        // Override
    }
}