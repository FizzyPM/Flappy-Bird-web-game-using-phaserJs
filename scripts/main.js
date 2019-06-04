var game = new Phaser.Game(650, 290, Phaser.AUTO);
var bg_scroll = -0.5;
var ground_scroll = -2.5;
var pipe_velocity = -150;

var playstate = 0;

var GameState = {
    preload: function(){
        this.load.image('background', 'assets/images/background.png');
        this.load.image('bird', 'assets/images/bird.png');
        this.load.image('ground', 'assets/images/ground.png');
        this.load.image('pipe', 'assets/images/pipe.png');
        this.load.image('uppipe', 'assets/images/uppipe.png');
    },
    create: function(){
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        
        this.background = this.game.add.tileSprite(0, 0, 650, 290, 'background')        
        // var spriteGroup = game.add.group();
        // var textGroup = game.add.group();
        
        game.paused = true;
        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.resume, this);
        
        this.bird = this.game.add.sprite(300, 140, 'bird')
        this.bird.anchor.setTo(-0.2, 0.5); 
        this.game.physics.arcade.enable(this.bird);
        this.bird.body.gravity.y = 1500; 
        
        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);

        this.timer = game.time.events.loop(1300, this.addPipe, this);
        this.pipes = game.add.group();
        // spriteGroup.add(this.pipes);

        this.text = this.game.add.text(10, 0, "SCORE:", {font:"30px flappy_font", fill:"#FFFFFF"});
        this.labelscore = this.game.add.text(100, 0, "", {font:"30px flappy_font", fill:"#FFFFFF"});
        // textGroup.add(this.text);
        this.score = 0;

        this.ground = this.game.add.tileSprite(0, 275, 650, 290, 'ground')
        // this.game.physics.arcade.enable(this.ground);
        // this.ground.body.velocity.x = -100;
    },
    update: function(){
        this.background.tilePosition.x += bg_scroll;
        this.ground.tilePosition.x += ground_scroll;
        
        this.game.physics.arcade.overlap(this.bird, this.pipes, this.restartGame, null, this);
        
        if (this.bird.y < 0 || this.bird.y > 250)
            this.restartGame();

        if (this.bird.angle < 20)
            this.bird.angle += 1; 

        // console.log(this.pipes.x);
        // this.pipes.forEach(element => {
        //     console.log(element.x);
        // });
    },
    resume: function(){
        game.paused = false;
    },
    jump: function(){
        this.bird.body.velocity.y = -300;
        game.add.tween(this.bird).to({angle: -20}, 100).start();  
    },
    restartGame: function(){
        game.state.start('GameState');
    },
    addPipe: function(){
        var deviation = Math.floor(Math.random() * 50) + 1;
        var prob = Math.round(Math.random());
        if(prob == 0){
            var lopipe = game.add.sprite(650, 190-deviation, 'pipe');
            var uppipe = game.add.sprite(650, -190-deviation, 'uppipe');
        }
        if(prob == 1){
            var lopipe = game.add.sprite(650, 190+deviation, 'pipe');
            var uppipe = game.add.sprite(650, -190+deviation, 'uppipe');
        }
        //uppipe.angle = -180;
        
        this.game.physics.arcade.enable(lopipe);
        lopipe.body.velocity.x = pipe_velocity;
        
        this.game.physics.arcade.enable(uppipe);
        uppipe.body.velocity.x = pipe_velocity;
        // pipe.height = 140;
        // pipe.scale.setTo(1,1);
        
        this.pipes.add(lopipe);
        this.pipes.add(uppipe);

        lopipe.checkWorldBounds = true;
        lopipe.outOfBoundsKill = true;
        uppipe.checkWorldBounds = true;
        uppipe.outOfBoundsKill = true;
        
        this.score += 1;
        this.labelscore.text = this.score; 
    }
};

game.state.add('GameState', GameState);
game.state.start('GameState');