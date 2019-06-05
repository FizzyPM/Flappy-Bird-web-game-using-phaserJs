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
    },
    create: function(){
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        
        this.background = this.game.add.sprite(0, 0, 'background');
        this.background.height = game.height;
        this.background.width = game.width;
        // var spriteGroup = game.add.group();
        // var textGroup = game.add.group();
        
        game.paused = true;
        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.resume, this);
        
        this.bird = this.game.add.sprite(155, 250, 'bird')
        this.bird.anchor.setTo(-0.2, 0.5); 
        this.game.physics.arcade.enable(this.bird);
        this.bird.body.gravity.y = 1600; 
        
        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);

        this.timer = game.time.events.loop(1700, this.addPipe, this);
        // this.timer = game.time.events.loop(1300, this.incscore, this);
        this.pipes = game.add.group();
        // spriteGroup.add(this.pipes);

        this.text = this.game.add.text(10, 0, "SCORE:", {font:"30px flappy_font", fill:"#FFFFFF"});
        this.labelscore = this.game.add.text(100, 0, "", {font:"30px flappy_font", fill:"#FFFFFF"});
        // textGroup.add(this.text);
        this.score = -1;

        this.ground = this.game.add.tileSprite(0, 455, 350, 500, 'ground')
        this.ground.scale.setTo(1,0.5);
        // this.game.physics.arcade.enable(this.ground);
        // this.ground.body.velocity.x = -100;
    },
    update: function(){
        // this.background.tilePosition.x += bg_scroll;
        this.ground.tilePosition.x += ground_scroll;
        
        this.game.physics.arcade.overlap(this.bird, this.pipes, this.restartGame, null, this);
        
        if (this.bird.y < 0 || this.bird.y > 450)
            this.restartGame();

        if (this.bird.angle < 20)
            this.bird.angle += 1; 

    },
    resume: function(){
        game.paused = false;
    },
    jump: function(){
        this.bird.body.velocity.y = -350;
        game.add.tween(this.bird).to({angle: -20}, 100).start();  
    },
    restartGame: function(){
        game.state.start('GameState');
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

        lopipe.checkWorldBounds = true;
        lopipe.outOfBoundsKill = true;
        uppipe.checkWorldBounds = true;
        uppipe.outOfBoundsKill = true;
        
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
        this.labelscore.text = this.score;
    },
    // incscore: function(){
    //     this.score +=1;
    //     this.labelscore.text = this.score;
    // },
};

game.state.add('GameState', GameState);
game.state.start('GameState');