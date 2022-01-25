/*
credits to following links used to download, convert and trim audio files:
https://www.zapsplat.com/
https://online-audio-converter.com/
https://clideo.com/

credits for text font:
https://www.fontspace.com/
*/

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;
var isJumping;

var trees_x;
var canyons;
var collectables;
var game_score;

var flagpole;
var lives;
var platforms;
var enemies;
var platformFont;
var statementFont;

var jumpSound;
var collectableSound;
var descendSound;
var enemySound;
var backgroundSong;

function preload()
{
    soundFormats('mp3','wav');
    
    //Jump sound.
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.1);
    
    //Collectible sound.
    collectableSound = loadSound('assets/collectable.wav')
    collectableSound.setVolume(0.2);
    
    //Descend sound.
    descendSound = loadSound('assets/descend.wav')
    descendSound.setVolume(0.03);
    
    //Enemy sound.
    enemySound = loadSound('assets/enemy.wav')
    enemySound.setVolume(0.07);
    
    //Thousand sunny font.
    platformFont = loadFont('assets/thousandsunny.ttf')
    
    //End, gameover statement font.
    statementFont = loadFont('assets/statement.otf')
}

function backgroundSound()
{
    //Background music.
    backgroundSong.setVolume(0.05);
    backgroundSong.loop();
}


function setup()
{
	createCanvas(1024, 576);
    
    floorPos_y = height * 3/4;
	
    lives = 3;
    
    startGame();
}


function startGame()
{
    if(lives == 1 || lives == 2 || lives == 3)
    {
        backgroundSong = loadSound('assets/bgm.wav', backgroundSound);
    }
        
    gameChar_x = width/2;
	gameChar_y = floorPos_y;
    
    
    // Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;
    isJumping = false;
    
	// Initialise arrays of scenery objects.
    trees_x = [145, 650, 1000, 1400, 1900, 2000, 2300, 2700, 3000, 3400, 3500];
  
    clouds = [{x_pos: 200, y_pos: 100, size: 75},
              {x_pos: 600, y_pos: 50, size: 75},
              {x_pos: 800, y_pos: 100, size: 75},
              {x_pos: 1100, y_pos: 100, size: 75},
              {x_pos: 1200, y_pos: 100, size: 75},
              {x_pos: 1400, y_pos: 100, size: 75},
              {x_pos: 1700, y_pos: 120, size: 75},
              {x_pos: 1850, y_pos: 100, size: 75}];
    
    mountains = [{x_pos: 300, y_pos: 200},
                 {x_pos: 1100, y_pos: 200},
                 {x_pos: 1800, y_pos: 200},
                 {x_pos: 2500, y_pos: 200},
                 {x_pos: 3200, y_pos: 200}];
    
    canyons = [{x_pos: 10, y_pos: 432, width: 100},
               {x_pos: 760, y_pos: 432, width: 100},
               {x_pos: 1500, y_pos: 432, width: 100},
               {x_pos: 2100, y_pos: 432, width: 100},
               {x_pos: 2800, y_pos: 432, width: 100},
               {x_pos: 3100, y_pos: 432, width: 100}];

    collectables = [{x_pos: 300, y_pos: 180, size: 30, isFound:false},
                    {x_pos: 1100, y_pos: 180, size: 30, isFound:false},
                    {x_pos: 1800, y_pos: 180, size: 30, isFound:false},
                    {x_pos: 2500, y_pos: 180, size: 30, isFound:false},
                    {x_pos: 3200, y_pos: 180, size: 30, isFound:false}];
    
    platforms = [];
    
    platforms.push(createPlatforms(450, floorPos_y - 100, 130), 
                   new createPlatforms(800, floorPos_y - 190, 130),
                   new createPlatforms(1300, floorPos_y - 150, 130),
                   new createPlatforms(1750, floorPos_y - 100, 130),
                   new createPlatforms(2150, floorPos_y - 200, 130),
                   new createPlatforms(2500, floorPos_y - 100, 130),
                   new createPlatforms(2850, floorPos_y - 220, 130),
                   new createPlatforms(3250, floorPos_y - 110, 130));
    
    game_score = 0;
    
    flagpole = {isReached: false, x_pos: 3700};
    
    enemies = [];
    enemies.push(new Enemy(350, floorPos_y - 10, 100),
                 new Enemy(1000, floorPos_y - 10, 100),
                 new Enemy(1700, floorPos_y - 10, 100),
                 new Enemy(2300, floorPos_y - 10, 100),
                 new Enemy(2650, floorPos_y - 10, 100),
                 new Enemy(2950, floorPos_y - 10, 100),
                 new Enemy(3300, floorPos_y - 10, 100));
}


function draw()
{
	background(100, 155, 255); //Sky colour.

	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height/4); //Ground colour.
    
    push();
    translate(scrollPos, 0);
    drawClouds();
    drawMountains();
    drawTrees();
    
    //Draw platforms.
    for(var i = 0; i < platforms.length; i++)
    {
        platforms[i].draw();
    }

	// Draw canyons.
     for(var i = 0; i < canyons.length; i++)
    {
        drawCanyon(canyons[i]);
        checkCanyon(canyons[i]);
    }

	// Draw collectable items.
    for(i = 0; i < collectables.length; i++)
    {
        if(!collectables[i].isFound)
        {
            drawCollectable(collectables[i]);
            checkCollectable(collectables[i]);
        }
    }
    
    renderFlagpole();
    
    checkPlayerDie();
    
    //Draw enemies.
    for(var i = 0; i < enemies.length; i++)
    {
        enemies[i].draw();
        var isContact = 
        enemies[i].checkContact(gameChar_world_x, gameChar_y);
        
        if(isContact)
        {
            if(lives > 0)
            {
                backgroundSong.stop();
                enemySound.play();
                lives -= 1;
                startGame();
            }
        }
    }
    
    pop();

	// Draw game character.
	drawGameChar();
    
    // Draw game over statement.
    if(lives < 1)
    {
        fill(0);
        noStroke();
        textFont(statementFont, 80);
        text("      GAME OVER \n Refresh to try again", width/2 - 300, height/2 - 50);
        return;
    }

    // Draw end statement.
     if(flagpole.isReached)
    {
        fill(0);
        noStroke();
        textFont(statementFont, 80);
        text("      LEVEL COMPLETE \n Press space to continue", width/2 - 335, height/2 - 50);
        return;
    }
    
    // Draw score.
    fill(0);
    noStroke;
    text("Treasure obtained: " + game_score, 20, 20);
    
    // Draw life tokens.
    drawLives();
    
	// Logic to make the game character move or the background scroll.
	if(isLeft)
    {
        if(gameChar_x > width * 0.2)
        {
            gameChar_x -= 5;
        }
        else
        {
            scrollPos += 5;
        }
    }

	if(isRight)
    {
        if(gameChar_x < width * 0.8)
        {
            gameChar_x  += 5;
        }
        else
        {
            scrollPos -= 5; // negative for moving against the background
        }
    }

	// Logic to make the game character rise and fall.
    if(gameChar_y != floorPos_y)
    {
        var isContact = false;
        for(var i = 0; i < platforms.length; i++)
        {
            if(platforms[i].checkContact(gameChar_world_x, gameChar_y) == true)
            {
                isContact = true;
                break;
            }
        }
        
        if(isContact == false)
        {
            isFalling = true;
            gameChar_y += 5
        }
    }

    else
    {
        isFalling = false;
    }

    if(isPlummeting == true)
    {
        gameChar_y += 10;
        backgroundSong.stop();
        descendSound.play();
    }

    if(flagpole.isReached == false)
    {
        checkFlagpole();
    }
    
	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
}

// ---------------------
// Key control functions
// ---------------------

function keyPressed(){

    if(keyCode == 37)
    {
        console.log("left arrow");
        isLeft = true;
    }
    
    else if(keyCode == 39)
    {
        console.log("right arrow");
        isRight = true;
    }

    else if(keyCode == 32)
    {
        console.log("spacebar");
        isJumping = true;
        gameChar_y -= 200;
        jumpSound.play();
    }


    //Open up the console to see how these work.
    console.log("keyPressed: " + key);
    console.log("keyPressed: " + keyCode);
}


function keyReleased()
{

    //Keys are released.
    if(keyCode == 37)
    {
        console.log("left arrow");
        isLeft = false;
    }

    else if(keyCode == 39)
    {
        console.log("right arrow");
        isRight = false;
    }

    console.log("keyReleased: " + key);
    console.log("keyReleased: " + keyCode);
}


// ------------------------------
// Game character render function
// ------------------------------


// Function to draw the game character.
function drawGameChar()
{
	//The game character.
	if(isLeft && isFalling)
	{
		// add your jumping-left code
        //head
        fill(255, 218, 185);
        ellipse(gameChar_x, gameChar_y - 50, 15, 20);

        //face
        fill(0);
        ellipse(gameChar_x - 5, gameChar_y - 52, 3, 6);

        //body and scar
        fill(255, 218, 185);
        rect(gameChar_x - 8, gameChar_y - 40, 15, 20);

        //arms and legs
        stroke(255, 218, 185);
        strokeWeight(6);
        line(gameChar_x, gameChar_y - 40, gameChar_x + 15, gameChar_y - 20);
        line(gameChar_x, gameChar_y - 5, gameChar_x, gameChar_y + 10);
        line(gameChar_x, gameChar_y + 10, gameChar_x + 5, gameChar_y + 10);
        noStroke();
        fill(100, 149, 237);
        rect(gameChar_x - 8, gameChar_y - 20, 15, 15);


        //hat
        fill(255, 215, 0);
        ellipse(gameChar_x, gameChar_y - 65, 30, 10);
        ellipse(gameChar_x, gameChar_y - 70, 15, 12);
	}
    
	else if(isRight && isFalling)
	{
		// add your jumping-right code
        //head
        fill(255, 218, 185);
        ellipse(gameChar_x, gameChar_y - 50, 15, 20);

        //face
        fill(0);
        ellipse(gameChar_x + 5, gameChar_y - 52, 3, 6);

        //body and scar
        fill(255, 218, 185);
        rect(gameChar_x - 8, gameChar_y - 40, 15, 20);

        //arms and legs
        stroke(255, 218, 185);
        strokeWeight(6);
        line(gameChar_x, gameChar_y - 40, gameChar_x - 15, gameChar_y - 20);
        line(gameChar_x, gameChar_y - 5, gameChar_x, gameChar_y + 10);
        line(gameChar_x, gameChar_y + 10, gameChar_x - 5, gameChar_y + 10);
        noStroke();
        fill(100, 149, 237);
        rect(gameChar_x - 8, gameChar_y - 20, 15, 15);


        //hat
        fill(255, 215, 0);
        ellipse(gameChar_x, gameChar_y - 65, 30, 10);
        ellipse(gameChar_x, gameChar_y - 70, 15, 12);
    }
	
    else if(isLeft)
	{
		// add your walking left code
        //head
        fill(255, 218, 185);
        ellipse(gameChar_x, gameChar_y - 50, 15, 20);

        //face
        fill(0);
        ellipse(gameChar_x - 5, gameChar_y - 48, 3, 6);

        //body and scar
        fill(255, 218, 185);
        rect(gameChar_x - 8, gameChar_y - 40, 15, 20);

        //arms and legs
        stroke(255, 218, 185);
        strokeWeight(6);
        line(gameChar_x, gameChar_y - 40, gameChar_x - 15, gameChar_y - 20);
        line(gameChar_x, gameChar_y - 5, gameChar_x + 5, gameChar_y + 10);
        line(gameChar_x, gameChar_y - 5, gameChar_x - 5, gameChar_y + 10);
        noStroke();
        fill(100, 149, 237);
        rect(gameChar_x - 8, gameChar_y - 20, 15, 15);


        //hat
        fill(255, 215, 0);
        ellipse(gameChar_x, gameChar_y - 55, 30, 10);
        ellipse(gameChar_x, gameChar_y - 60, 15, 12);
	}
    
	else if(isRight)
	{
		// add your walking right code
        //head
        fill(255, 218, 185);
        ellipse(gameChar_x, gameChar_y - 50, 15, 20);

        //face
        fill(0);
        ellipse(gameChar_x + 5, gameChar_y - 48, 3, 6);

        //body and scar
        fill(255, 218, 185);
        rect(gameChar_x - 8, gameChar_y - 40, 15, 20);

        //arms and legs
        stroke(255, 218, 185);
        strokeWeight(6);
        line(gameChar_x, gameChar_y - 40, gameChar_x + 15, gameChar_y - 20);
        line(gameChar_x, gameChar_y - 5, gameChar_x + 5, gameChar_y + 10);
        line(gameChar_x, gameChar_y - 5, gameChar_x - 5, gameChar_y + 10);
        noStroke();
        fill(100, 149, 237);
        rect(gameChar_x - 8, gameChar_y - 20, 15, 15);


        //hat
        fill(255, 215, 0);
        ellipse(gameChar_x, gameChar_y - 55, 30, 10);
        ellipse(gameChar_x, gameChar_y - 60, 15, 12);
	}
    
	else if(isFalling || isPlummeting)
	{
		// add your jumping facing forwards code
         //head
        fill(255, 218, 185);
        ellipse(gameChar_x, gameChar_y - 50, 20);

        //face
        fill(0);
        ellipse(gameChar_x - 4, gameChar_y - 52, 5, 6);
        ellipse(gameChar_x + 4, gameChar_y - 52, 5, 6);

        //body and scar
        fill(255, 218, 185);
        rect(gameChar_x - 10, gameChar_y - 40, 20, 20);
        stroke(139,0,0);
        strokeWeight(4);
        line(gameChar_x - 5, gameChar_y - 37, gameChar_x + 5, gameChar_y - 27);
        line(gameChar_x + 5, gameChar_y - 37, gameChar_x - 5, gameChar_y - 27);

        //arms and legs
        stroke(255, 218, 185);
        strokeWeight(6);
        line(gameChar_x - 10, gameChar_y - 42, gameChar_x - 20, gameChar_y - 32);
        line(gameChar_x + 10, gameChar_y - 42, gameChar_x + 20, gameChar_y - 32);
        line(gameChar_x - 5, gameChar_y - 5, gameChar_x - 5, gameChar_y + 3);
        line(gameChar_x + 5, gameChar_y - 5, gameChar_x + 5, gameChar_y + 3);
        noStroke();
        fill(100, 149, 237);
        rect(gameChar_x - 10, gameChar_y - 20, 9, 15);
        rect(gameChar_x + 2, gameChar_y - 20, 9, 15);

        //hat
        fill(255, 215, 0);
        ellipse(gameChar_x, gameChar_y - 65, 30, 10);
        ellipse(gameChar_x, gameChar_y - 70, 15, 12);
	}
    
	else
	{
		// add your standing front facing code
        //head
        fill(255, 218, 185);
        ellipse(gameChar_x, gameChar_y - 50, 20);
    
        //face
        fill(0);
        ellipse(gameChar_x - 4, gameChar_y - 48, 5, 6);
        ellipse(gameChar_x + 4, gameChar_y - 48, 5, 6);
    
        //body and scar
        fill(255, 218, 185)
        rect(gameChar_x - 10, gameChar_y - 40, 20, 20);
        stroke(139,0,0);
        strokeWeight(4);
        line(gameChar_x - 5, gameChar_y - 37, gameChar_x + 5, gameChar_y - 27);
        line(gameChar_x + 5, gameChar_y - 37, gameChar_x - 5, gameChar_y - 27);
    
        //arms and legs
        stroke(255, 218, 185);
        strokeWeight(6);
        line(gameChar_x - 10, gameChar_y - 37, gameChar_x - 20, gameChar_y - 27);
        line(gameChar_x + 10, gameChar_y - 37, gameChar_x + 20, gameChar_y - 27);
        line(gameChar_x - 5, gameChar_y - 5, gameChar_x - 5, gameChar_y + 10);
        line(gameChar_x + 5, gameChar_y - 5, gameChar_x + 5, gameChar_y + 10);
        noStroke();
        fill(100, 149, 237);
        rect(gameChar_x - 10, gameChar_y - 20, 9, 15);
        rect(gameChar_x + 2, gameChar_y - 20, 9, 15);
   
        //hat
        fill(255, 215, 0);
        ellipse(gameChar_x, gameChar_y - 55, 30, 10);
        ellipse(gameChar_x, gameChar_y - 60, 15, 12);
	}
}

// ---------------------------
// Background render functions
// ---------------------------


// Function to draw cloud objects.
function drawClouds()
{
    for(var i = 0; i < clouds.length; i++)
    {
    noStroke();
	fill(255);
    ellipse(clouds[i].x_pos, clouds[i].y_pos, clouds[i].size, clouds[i].size);
    ellipse(clouds[i].x_pos - 40, clouds[i].y_pos, clouds[i].size - 15, clouds[i].size - 15);
    ellipse(clouds[i].x_pos + 50, clouds[i].y_pos + 20, clouds[i].size + 15, clouds[i].size + 15);
    ellipse(clouds[i].x_pos + 50, clouds[i].y_pos + 20, clouds[i].size + 15, clouds[i].size + 15);
    ellipse(clouds[i].x_pos + 90, clouds[i].y_pos, clouds[i].size + 15, clouds[i].size + 5); 
    };
}


// Function to draw mountains objects.
function drawMountains()
{
    for(var i = 0; i < mountains.length; i++)
    {
    noStroke();
	fill(255);
    triangle(mountains[i].x_pos, mountains[i].y_pos, mountains[i].x_pos - 200, mountains[i].y_pos + 230, mountains[i].x_pos + 250, mountains[i].y_pos + 230);
    fill(150, 180, 200);
    triangle(mountains[i].x_pos, mountains[i].y_pos, mountains[i].x_pos - 90, mountains[i].y_pos + 100, mountains[i].x_pos + 90, mountains[i].y_pos + 80);
    };
}


// Function to draw trees objects.
function drawTrees()
{
    for(var i = 0; i < trees_x.length; i++)
    {
    //draw tree
    //branch
    noStroke();
    fill(153, 76, 0);
    rect(trees_x[i], floorPos_y - 100, 30, 150);
    //canopy
    fill(0, 102, 51);
    triangle(trees_x[i] + 10, floorPos_y - 150, trees_x[i] - 50, floorPos_y - 80, trees_x[i] + 80, floorPos_y - 80);
    triangle(trees_x[i] + 10, floorPos_y - 190, trees_x[i] - 40, floorPos_y - 130, trees_x[i] + 60, floorPos_y - 130);
    triangle(trees_x[i] + 10, floorPos_y - 220, trees_x[i] - 30, floorPos_y - 170, trees_x[i] + 50, floorPos_y - 170);
    //snow on tree
    fill(255, 255, 255);
    triangle(trees_x[i] + 10, floorPos_y - 220, trees_x[i] - 10, floorPos_y - 200, trees_x[i] + 30, floorPos_y - 200);
    }
}

// ---------------------------------
// Canyon render and check functions
// ---------------------------------


// Function to draw canyon objects.
function drawCanyon(t_canyon)
{
    for(var i = 0; i < canyons.length; i++)
    {
    fill(47, 79, 79);
    rect(t_canyon.x_pos, t_canyon.y_pos, t_canyon.width, 150);      
    }
}


// Function to check character is over a canyon.
function checkCanyon(t_canyon)
{
    if((gameChar_world_x >= t_canyon.x_pos && gameChar_world_x <= (t_canyon.x_pos + t_canyon.width)) && gameChar_y >= floorPos_y)
    {
        isPlummeting = true;
    }
}


function renderFlagpole()
{
    push();
    strokeWeight(5);
    stroke(255);
    line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 250);
    noStroke();
    
    if(flagpole.isReached)
    {
        stroke(255);
        strokeWeight(2);
        fill(0);
        rect(flagpole.x_pos, floorPos_y - 250, 80, 50);
        textSize(40);
        text("X", flagpole.x_pos + 22, floorPos_y - 207);
    }
    
    else
    {
        stroke(255);
        strokeWeight(2);
        fill(0);
        rect(flagpole.x_pos, floorPos_y - 50, 80, 50);
        textSize(40);
        text("X", flagpole.x_pos + 22, floorPos_y - 7 );
    }
    pop();
}


function checkFlagpole()
{
    var j = abs(gameChar_world_x - flagpole.x_pos);
    
    if(j < 15)
    {
        flagpole.isReached = true;
        backgroundSong.stop();
    }
}

function drawLives()
{
    for(i = 0; i < lives; i++)
    {
        fill(255, 218, 185);
        ellipse(105 + i*35, 46, 18, 20);
        fill(0);
        ellipse(101 + i*35, 46, 5, 6);
        ellipse(108 + i*35, 46, 5, 6);
        fill(255, 215, 0);
        ellipse(105 + i*35, 39, 30, 10);
        ellipse(105 + i*35, 35, 15, 12);
    }
    fill(0);
    noStroke();
    text("Luffy's lives: ", 20, 46);
}

function checkPlayerDie()
{   
    if(gameChar_y > floorPos_y + 500) 
    {
        if(lives > 0)
        {
            lives -= 1;
            startGame();
        }                
    }
}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------


// Function to draw collectable objects.
function drawCollectable(t_collectable)
{
    for(var i = 0; i < collectables.length; i++)
    {
    noStroke();
    fill(218, 112, 214);
    ellipse(t_collectable.x_pos + 4, t_collectable.y_pos, t_collectable.size, t_collectable.size);
    fill(221, 160, 221);
    ellipse(t_collectable.x_pos, t_collectable.y_pos, t_collectable.size, t_collectable.size);  
    fill(0, 0, 128);
    textSize(25);
    text("$", t_collectable.x_pos - 5, t_collectable.y_pos + 10);
    }
}


// Function to check character has collected an item.
function checkCollectable(t_collectable)
{
   if(dist(gameChar_world_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos) < 50)
    {
        t_collectable.isFound = true;
        game_score += 1;
        collectableSound.play();
    }
    
}


//Function to create platforms.
function createPlatforms(x, y, length)
{
    var p = {
        x: x,
        y: y,
        length: length,
        draw: function() {
        //ship body
        stroke(0);
        strokeWeight(2);
        fill(218, 165, 32);
        arc(this.x, this.y, this.length, 80, 0, PI);
        rect(this.x, this.y - 70, 5, this.length - 60);
        fill(255);
        triangle(this.x + 5, this.y - 70, this.x + 45, this.y - 55, this.x + 5, this.y - 40);
            
        //ship name and flag logo
        textFont(platformFont, 13);
        fill(180, 0, 0);
        stroke(0);
        strokeWeight(0.5);
        text("Thousand \n     Sunny", this.x - 42, this.y + 17);
        textSize(15);
        text("X", this.x + 9, this.y - 48);
        noStroke();
        //rect(this.x, this.y, this.length, 20);
        },
        checkContact: function(gameChar_world_x, gameChar_y)
        {
            if(gameChar_world_x > this.x - this.length/2 && gameChar_world_x < this.x + this.length/2)
            {
                var d = this.y - gameChar_y;
                if(d >= 0 && d < 5)
                {
                    return true;
                }
            }
            return false;
        }
        }
return p;
}


//Function to create enemies.
function Enemy(x, y, range)
{
    this.x = x;
    this.y = y;
    this.range = range;
    
    this.currentX = x;
    this.inc = 1;
    
    this.update = function()
    {
        this.currentX += this.inc;
        
        if(this.currentX >= this.x + this.range)
        {
            this.inc = -1;
        }
        
        else if(this.currentX < this.x)
        {
            this.inc = 1;
        }
    }
    this.draw = function()
    {
        this.update();
        //wick 
        rect(this.currentX - 1, this.y - 23, 3, 10);
        
        //flame
        fill(255, 69, 0)
        triangle(this.currentX, this.y - 30, this.currentX + 5, this.y - 25, this.currentX - 3, this.y - 20);
        
        //bomb
        fill(0);
        ellipse(this.currentX, this.y, 30, 30);
        fill(255);
        rect(this.currentX + 7, this.y - 8, 3, 5);   
        fill(200, 0, 0);
        ellipse(this.currentX - 4, this.y, 6, 8);
        ellipse(this.currentX + 4, this.y, 6, 8);
    }
    
    this.checkContact = function()
    {
        var d = dist(gameChar_world_x, gameChar_y, this.currentX, this.y)
        
        if(d < 20)
        {
            return true;
        }
    return false;
    }
}
