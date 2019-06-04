// Create our 'main' state that will contain the game
var mainState = {
    preload: function() { 
        game.load.image('bird', 'assets/bird.png'); 
        game.load.image('pipe', 'assets/pipe.png'); 
        game.load.audio('jump', 'assets/jump.wav'); 
    },

    create: function() { 
        game.stage.backgroundColor = '#71c5cf';
        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.bird = game.add.sprite(100, 245, 'bird');
        this.bird.anchor.setTo(-0.2, 0.5);

        game.physics.arcade.enable(this.bird);
        this.bird.body.gravity.y = 1000;

        var spaceKey = game.input.keyboard.addKey(
            Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);

        this.pipes = game.add.group();
        this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);

        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0", 
        { font: "30px Arial", fill: "#ffffff" });

        this.jumpSound = game.add.audio('jump'); 

        if (game.device.desktop == false) {
            // Set the scaling mode to SHOW_ALL to show all the game
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        
            // Set a minimum and maximum size for the game
            // Here the minimum is half the game size
            // And the maximum is the original game size
            game.scale.setMinMax(game.width/2, game.height/2, 
                game.width, game.height);
        
        }

        // Center the game horizontally and vertically
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;

        game.input.onDown.add(this.jump, this);

    },

    update: function() {
        if (this.bird.y < 0 || this.bird.y > 490)
            this.restartGame();   
        
        game.physics.arcade.overlap(
        this.bird, this.pipes, this.hitPipe, null, this);

        if (this.bird.angle < 20)
            this.bird.angle += 1;
    },

    jump: function() {
        // Add a vertical velocity to the bird
        this.bird.body.velocity.y = -350;
        
        game.add.tween(this.bird).to({angle: -20}, 100).start(); 

        if (this.bird.alive == false)
            return;  

        this.jumpSound.play();
    },

    restartGame: function() {
        // Start the 'main' state, which restarts the game
        game.state.start('main');
    },

    addOnePipe: function(x, y) {
        var pipe = game.add.sprite(x, y, 'pipe');
        this.pipes.add(pipe);
    
        game.physics.arcade.enable(pipe);
        pipe.body.velocity.x = -200; 

        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },

    addRowOfPipes: function() {
        var hole = Math.floor(Math.random() * 5) + 1;
    
        // Add the 6 pipes 
        // With one big hole at position 'hole' and 'hole + 1'
        for (var i = 0; i < 8; i++)
            if (i != hole && i != hole + 1) 
                this.addOnePipe(400, i * 60 + 10);   

        this.score += 1;
        this.labelScore.text = this.score;  
    },

    hitPipe: function() {
        // If the bird has already hit a pipe, do nothing
        // It means the bird is already falling off the screen
        if (this.bird.alive == false)
            return;
    
        // Set the alive property of the bird to false
        this.bird.alive = false;
    
        // Prevent new pipes from appearing
        game.time.events.remove(this.timer);
    
        // Go through all the pipes, and stop their movement
        this.pipes.forEach(function(p){
            p.body.velocity.x = 0;
        }, this);
    }, 

};

// Initialize Phaser, and create a 400px by 490px game
var game = new Phaser.Game(400, 490);

// Add the 'mainState' and call it 'main'
game.state.add('main', mainState); 

// Start the state to actually start the game
game.state.start('main');