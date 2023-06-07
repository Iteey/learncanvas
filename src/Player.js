import { Physics } from "phaser";
import { Bullet } from "./Bullet";
import { InputManager } from "./InputManager";

export class Player extends Physics.Arcade.Sprite {
    input;
    shootInterval = 500;
    lastShotTime = 0;
    constructor(scene, x, y){
        super(scene, x, y, 'atlas', 'elf_m_idle_anim_0');
        scene.physics.add.existing(this);
        this.body.setOffset(0, 12);
        this.body.setSize(16, 16, false);
        this.body.setMaxSpeed(400);
        this.body.setDrag(800, 800);
        this.anims.create({
            key: 'elf_m_idle_anim',
            frames: this.anims.generateFrameNames('atlas', { prefix: 'elf_m_idle_anim_', start:0, end: 3}),
            repeat: -1,
            frameRate: 8,
        });
        this.anims.create({
            key: 'elf_m_run_anim',
            frames: this.anims.generateFrameNames('atlas', { prefix: 'elf_m_run_anim_', start:0, end: 3}),
            repeat: -1,
            frameRate: 8,
        });
        this.anims.create({
            key: 'elf_m_hit_anim',
            frames: this.anims.generateFrameNames('atlas', { prefix: 'elf_m_hit_anim_', start:0, end: 0}),
            repeat: -1,
            frameRate: 8,
        });
        this.anims.play('elf_m_idle_anim');
        this.setScale(4);
        this.input = new InputManager(scene);
        this.arrowCount = 0;
        this.maxArrows = 20;
    }
    isMoving(){
        return this.body.speed > 0;
    }
    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        if(this.input.keys.KeyA.isDown) {
            this.body.setVelocityX(-this.body.maxSpeed);
            this.setFlipX(true);
        }
        if(this.input.keys.KeyD.isDown) {
            this.body.setVelocityX(this.body.maxSpeed);
            this.setFlipX(false);
        }
        if(this.input.keys.KeyW.isDown) {
            this.body.setVelocityY(-this.body.maxSpeed);
        }
        if(this.input.keys.KeyS.isDown) {
            this.body.setVelocityY(this.body.maxSpeed);
        }
        if(this.input.keys.Space.isDown){
            if(time - this.lastShotTime > this.shootInterval && this.arrowCount < this.maxArrows && time - this.lastShotTime > this.shootInterval){
                this.scene.add.existing(new Bullet(this.scene, this.x, this.y, this.input.mouse));
                this.lastShotTime = time;
                this.arrowCount++;
                this.scene.arrowCountText.setText(`Arrows: ${this.arrowCount}/${this.maxArrows}`);
            }
        }
        if(this.isMoving()){
            this.play('elf_m_run_anim', true);
        } else {
            this.play('elf_m_idle_anim', true);
        }
    }
    pickUpItem() {
        this.arrowCount = 0;
        this.scene.arrowCountText.setText(`Arrows: ${this.arrowCount}/${this.maxArrows}`);
    }
}
