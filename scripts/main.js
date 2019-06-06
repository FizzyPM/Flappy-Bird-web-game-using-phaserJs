var game = new Phaser.Game(350, 500, Phaser.AUTO);
var ground_scroll = -2.5;
var pipe_velocity = -150;
var playstate = 0;

var GameState = {
    preload: function(){
        this.load.image('background', 'assets/images/background2.png');
        this.load.image('bird', 'assets/images/bird.png');
        this.load.image('ground', 'assets/images/ground2.png');
        this.load.image('pipe', 'assets/images/pipe1.png');
        this.load.image('uppipe', 'assets/images/uppipe.png');
        this.load.image('button', 'assets/images/restart.png');
        game.load.audio('jump', 'assets/audio/jump.wav'); 
        game.load.audio('bgmusic', 'assets/audio/marios_way.mp3'); 
        game.load.audio('score', 'assets/audio/score.wav'); 
        game.load.audio('explosion', 'assets/audio/explosion.wav'); 
        this.game.load.bitmapFont('headingfont', 'assets/fonts/font.png', 'assets/fonts/font.fnt');
        this.game.load.bitmapFont('scorefont', 'assets/fonts/font1.png', 'assets/fonts/font1.fnt');
        this.game.load.bitmapFont('resultfont', 'assets/fonts/font2.png', 'assets/fonts/font2.fnt');
    },
    create: function(){
        game.sound.stopAll();
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
        // var spriteGroup = game.add.group();
        // var textGroup = game.add.group();
        
        this.game.paused = true;
        game.input.onDown.add(this.playGame, this);
        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.playGame, this);
        
        this.bird = this.game.add.sprite(155, 250, 'bird')
        this.pipes = game.add.group();
        
        this.bird.anchor.setTo(-0.2, 0.5); 
        this.game.physics.arcade.enable(this.bird);
        this.bird.body.gravity.y = 1600; 
        
        // console.log(game.cache._cache.bitmapFont)
        this.gamename = this.game.add.bitmapText(game.world.centerX, 160, 'headingfont', 'Fizzy Bird' , 60);
        this.gamename.anchor.setTo(0.5);
        
        game.input.onDown.add(this.jump, this);

        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);
        
        this.timer = game.time.events.loop(1700, this.addPipe, this);
        // this.timer = game.time.events.loop(1300, this.incscore, this);
        // spriteGroup.add(this.pipes);
        
        this.text = this.game.add.bitmapText(10, 0, 'scorefont', 'SCORE:' , 30);
        this.labelscore = this.game.add.bitmapText(110, 0, 'scorefont', '0' , 30);
        // textGroup.add(this.text);
        
        this.score = -1;
        
        this.ground = this.game.add.tileSprite(0, 455, 350, 500, 'ground')
        this.ground.scale.setTo(1,0.5);
        // this.game.physics.arcade.enable(this.ground);
        // this.ground.body.velocity.x = -100;
        
        this.jumpSound = game.add.audio('jump'); 
        this.scoreSound = game.add.audio('score'); 
        this.explosionSound = game.add.audio('explosion');
        this.bgmusic = game.add.audio('bgmusic'); 
        this.bgmusic.loop = true;
        this.bgmusic.play();
        this.bgmusic.volume = 0.3;
        
    },
    update: function(){
        // this.background.tilePosition.x += bg_scroll;
        this.ground.tilePosition.x += ground_scroll;
        
        this.game.physics.arcade.overlap(this.bird, this.pipes, this.gameover, null, this);
        
        if (this.bird.y < 0 || this.bird.y > 450)
            this.gameover();
    
        if (this.bird.angle < 20)
            this.bird.angle += 1; 
        
    },
    playGame: function(){
        this.gamename.destroy();
        this.game.paused = false;
    },
    jump: function(){
        if (this.bird.alive == false)
            return;
        this.bird.body.velocity.y = -350;
        this.game.add.tween(this.bird).to({angle: -20}, 100).start();  
        this.jumpSound.play(); 
        this.jumpSound.volume = 0.5;
    },
    gameover: function(){
        if (this.bird.alive == false)
            return;
        this.explosionSound.play();
        this.explosionSound.volume = 0.3;
        this.bird.alive = false;
        this.game.time.events.remove(this.timer);
        this.pipes.forEach(function(p){
            p.body.velocity.x = 0;
        }, this);
        ground_scroll = 0;
        this.result = this.game.add.bitmapText(game.world.centerX, 160, 'resultfont', "SCORE:"+String(this.labelscore.text) , 70);
        this.result.anchor.setTo(0.5);
        this.text.destroy();
        this.labelscore.destroy();
        var button = this.game.add.bitmapText(game.world.centerX, 250, 'resultfont', "Restart" , 30);
        button.anchor.setTo(0.5);
        button.inputEnabled = true;
        button.events.onInputDown.add(this.restartGame, this);
        // button.scale.setTo(0.1);
        // var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        // spaceKey.onDown.add(this.restartGame, this);
    },
    restartGame: function(){
        ground_scroll = -2.5;
        this.bird.alive = true;
        this.result.destroy();
        game.state.start('GameState', true, true);
    },
    addPipe: function(){
        var deviation = Math.floor(Math.random() * 100) + 1;   // 100
        var prob = Math.round(Math.random());
        // var prob = 1;
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
        //uppipe.angle = -180;
        
        this.game.physics.arcade.enable(lopipe);
        lopipe.body.velocity.x = pipe_velocity;
        
        this.game.physics.arcade.enable(uppipe);
        uppipe.body.velocity.x = pipe_velocity;
        // pipe.height = 140;
        // pipe.scale.setTo(1,1);
     
        // console.log(lopipe)
        // for (var key in lopipe) {
        //     console.log(key + ' -> ' + lopipe[key]);
        // }

        this.pipes.add(lopipe);
        this.pipes.add(uppipe);

        this.pipes.checkWorldBounds = true;
        this.pipes.outOfBoundsKill = true;
        
        // console.log('----');
        // console.log(typeof(this.pipes));
        // console.log((this.pipes));
        
        /*
        -----> REQUIRED OBJECT <-----
        this.pipes.forEach(function(element){
                console.log(element);
        });
        ---> OR <---
        for (var i = 0, len = this.pipes.children.length; i < len; i++) {
            console.log((this.pipes.children[i]).position);
        }
        */
        /*
        -----> IRRELEVENT <-----
        for (let i in this.pipes) {  
            console.log(i);
        }
        console.log(this.pipes[Object.keys(this.pipes)[0]]);
        */

        this.score +=1;
        if(this.score > 0){
            this.labelscore.text = this.score;
            this.scoreSound.play();
            this.scoreSound.volume = 0.5;
        }
    },
    // incscore: function(){
    //     this.score +=1;
    //     this.labelscore.text = this.score;
    // },
};

game.state.add('GameState', GameState);
game.state.start('GameState');