var game = new Phaser.Game(350, 500, Phaser.AUTO);
var ground_scroll = -2.5;
var pipe_velocity = -150;
var bird;
var score;

var GameState = {
    preload: function(){
        this.load.image('background', 'assets/images/background2.png');
        this.load.image('bird', 'assets/images/bird.png');
        this.load.image('ground', 'assets/images/ground2.png');
        game.load.audio('bgmusic', 'assets/audio/marios_way.mp3'); 
        this.game.load.bitmapFont('headingfont', 'assets/fonts/font.png', 'assets/fonts/font.fnt');
        //
        this.load.image('pipe', 'assets/images/pipe1.png');
        this.load.image('uppipe', 'assets/images/uppipe.png');
        game.load.audio('jump', 'assets/audio/jump.wav'); 
        game.load.audio('score', 'assets/audio/score.wav'); 
        game.load.audio('explosion', 'assets/audio/explosion.wav');
        this.game.load.bitmapFont('scorefont', 'assets/fonts/font1.png', 'assets/fonts/font1.fnt');
        //
        this.game.load.bitmapFont('resultfont', 'assets/fonts/font2.png', 'assets/fonts/font2.fnt');
    },
    create: function(){
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        if (game.device.desktop == false) {
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    
            game.scale.setMinMax(game.width/2, game.height/2, 
                game.width, game.height);
        
            game.scale.pageAlignHorizontally = true;
            game.scale.pageAlignVertically = true;
        }
        
        this.background = this.game.add.sprite(0, 0, 'background');
        this.background.height = this.game.height;
        this.background.width = this.game.width;

        bird = this.game.add.sprite(155, 250, 'bird')
        bird.anchor.setTo(-0.2, 0.5); 

        this.ground = this.game.add.tileSprite(0, 455, 350, 500, 'ground')
        this.ground.scale.setTo(1,0.5);

        this.gamename = this.game.add.bitmapText(game.world.centerX, 160, 'headingfont', 'Fizzy Bird' , 60);
        this.gamename.anchor.setTo(0.5);

        this.bgmusic = game.add.audio('bgmusic'); 
        this.bgmusic.loop = true;
        this.bgmusic.play();
        this.bgmusic.volume = 0.5;

    },
    update: function(){
        this.ground.tilePosition.x += ground_scroll;
        game.input.onDown.add(this.playGame, this);
        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.playGame, this);
    },
    playGame: function(){
        // console.log('1')
        this.ground.destroy();
        this.gamename.destroy();
        game.state.start('PlayState',false,false);                  
    }
}
var PlayState = {
    // preload: function(){
        
    // },
    create: function(){
        this.game.physics.arcade.enable(bird);
        bird.body.gravity.y = 1600; 
        bird.body.velocity.y = -400;
        this.game.add.tween(bird).to({angle: -20}, 100).start(); 

        this.pipes = game.add.group(); 
        this.timer = game.time.events.loop(1700, this.addPipe, this);

        this.text = this.game.add.bitmapText(10, 0, 'scorefont', 'SCORE:' , 30);
        this.labelscore = this.game.add.bitmapText(110, 0, 'scorefont', '0' , 30);

        this.ground = this.game.add.tileSprite(0, 455, 350, 500, 'ground')
        this.ground.scale.setTo(1,0.5);

        game.input.onDown.add(this.jump, this);
        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);

        this.jumpSound = game.add.audio('jump'); 
        this.scoreSound = game.add.audio('score'); 
        this.explosionSound = game.add.audio('explosion');

        this.score = -1;
    },
    update: function(){
        this.ground.tilePosition.x += ground_scroll;
        this.game.physics.arcade.overlap(bird, this.pipes, this.gameover, null, this);
        
        if (bird.y < 0 || bird.y > 450)
            this.gameover();

        if (bird.angle < 20)
            bird.angle += 1; 
    },
    jump: function(){
        if (bird.alive == false)
            return;
        bird.body.velocity.y = -350;
        this.game.add.tween(bird).to({angle: -20}, 100).start();  
        this.jumpSound.play(); 
        this.jumpSound.volume = 0.5;
    },
    addPipe: function(){
        var deviation = Math.floor(Math.random() * 100) + 1;   // 100
        var prob = Math.round(Math.random());
        if(prob == 0){
            var lopipe = game.add.sprite(350, 275-deviation, 'pipe');   // max upper = 80, max lower = 410
            lopipe.scale.setTo(0.5,0.5);
            var uppipe = game.add.sprite(350, -215-deviation, 'uppipe'); // max upper = -330, max lower = -5
            uppipe.scale.setTo(0.5,0.5);

        }
        if(prob == 1){
            var lopipe = game.add.sprite(350, 275+deviation, 'pipe');
            lopipe.scale.setTo(0.5,0.5);
            var uppipe = game.add.sprite(350, -215+deviation, 'uppipe');
            uppipe.scale.setTo(0.5,0.5);
        }

        this.game.physics.arcade.enable(lopipe);
        lopipe.body.velocity.x = pipe_velocity;
        this.game.physics.arcade.enable(uppipe);
        uppipe.body.velocity.x = pipe_velocity;

        // this.pipes.forEach(function(element){
        //     console.log(element);
        // });

        this.pipes.add(lopipe);
        this.pipes.add(uppipe);

        // lopipe.checkWorldBounds = true;
        // lopipe.outOfBoundsKill = true;
        // uppipe.checkWorldBounds = true;
        // uppipe.outOfBoundsKill = true;
        this.pipes.checkWorldBounds = true;
        this.pipes.outOfBoundsKill = true;

        this.score +=1;
        if(this.score > 0){
            this.labelscore.text = this.score;
            this.scoreSound.play();
            this.scoreSound.volume = 0.5;
        }
    },
    gameover: function(){
        if (bird.alive == false)
            return;
        this.explosionSound.play();
        this.explosionSound.volume = 0.3;
        bird.alive = false;
        score = this.labelscore.text;
        this.game.time.events.remove(this.timer);
        this.pipes.forEach(function(p){
            p.body.velocity.x = 0;
        }, this);
        ground_scroll = 0;
        this.text.destroy();
        this.labelscore.destroy();
        game.state.start('GameOver',false,false); 
    }
}
var GameOver = {
    // preload: function(){
        
    // },
    create: function(){
        this.result = this.game.add.bitmapText(game.world.centerX, 160, 'resultfont', "SCORE:"+String(score) , 70);
        this.result.anchor.setTo(0.5);
        var button = this.game.add.bitmapText(game.world.centerX, 250, 'resultfont', "Restart" , 30);
        button.anchor.setTo(0.5);
        button.inputEnabled = true;
        button.events.onInputDown.add(this.restartGame, this);
    },
    restartGame: function(){
        ground_scroll = -2.5;
        bird.alive = true;
        this.result.destroy();
        bird.kill();
        game.state.start('GameState', true, true);
    }
}
game.state.add('GameState', GameState);
game.state.add('PlayState', PlayState);
game.state.add('GameOver', GameOver);
game.state.start('GameState');
