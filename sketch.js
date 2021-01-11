// Setting the gameState and Score
var gameState = "intro";
// // Creating obstacles variables
let crates = [];
let obs = [];
let zomb = [];
// creating scoring system
var score = 0;

function preload() {
    // Loading Girl's Images
    girl_run = loadAnimation("Assets/Run (1).png", "Assets/Run (2).png", "Assets/Run (3).png", "Assets/Run (4).png", "Assets/Run (5).png", "Assets/Run (6).png", "Assets/Run (7).png", "Assets/Run (8).png");
    girl_shoot = loadImage("Assets/Shoot (1).png");
    girl_jump1 = loadImage("Assets/Jump (4).png");
    girl_jump2 = loadImage("Assets/Jump (5).png");
    bulletImg = loadImage("Assets/Bullet1.png");
    // Loading zombie Animation
    zombieImg = loadAnimation("Assets/Idle (1).png", "Assets/Idle (2).png", "Assets/Idle (3).png", "Assets/Idle (4).png", "Assets/Idle (5).png", "Assets/Idle (6).png", "Assets/Idle (7).png", "Assets/Idle (8).png", "Assets/Idle (9).png", "Assets/Idle (10).png", "Assets/Idle (11).png", "Assets/Idle (12).png", "Assets/Idle (13).png", "Assets/Idle (14).png", "Assets/Idle (15).png");
    // Loading buttons' images
    play1 = loadImage("Assets/play1.png");
    play2 = loadImage("Assets/play2.png");
    restart1 = loadImage("Assets/restart1.png");
    restart2 = loadImage("Assets/restart2.png");
    // Loading bg images
    bgintro = loadImage("Assets/intro1.jpg");
    bgimg = loadImage("Assets/bg.png");
    // Loading ground and platforms' Images
    groundImg = loadImage("Assets/Floor Tile.png");
    floatingtileImg = loadImage("Assets/Floating Tile.png");
    platformImg = loadImage("Assets/Platform.png");
    // Loading Obstacles Images
    crateimg = loadImage("Assets/Crate.png");
    grave = loadImage("Assets/TombStone (1).png");
    skeletonimg = loadImage("Assets/Skeleton.png");
    // loading score image
    scoreImg = loadImage("Assets/Idle (1).png");
    // loading sounds
    bgsound = loadSound("Assets/spooky.mp3");
    gunsound = loadSound("Assets/gun.mp3");
    dead = loadSound("Assets/dead.mp3");
}

function setup() {
    createCanvas(900, 600);

    ground1 = createSprite(900, 414);
    ground1.addImage("groundImg", groundImg);

    ground2 = createSprite(3100, 414);
    ground2.addImage("groundImg", groundImg);

    invisible_ground1 = createSprite(900, 485, 1800, 10);
    invisible_ground1.visible = false;
    invisible_ground2 = createSprite(3100, 485, 1800, 10);
    invisible_ground2.visible = false;

    girl = createSprite(450, 380);
    girl.addAnimation("girl_run", girl_run);
    girl.addImage("girl_shoot", girl_shoot);
    girl.addImage("girl_jump1", girl_jump1);
    girl.addImage("girl_jump2", girl_jump2);
    girl.scale = 0.375;
    girl.frameDelay = 3;
    girl.setCollider("rectangle", 0, 0, 200, 500);

    play = createSprite(450, 300);
    play.addImage("play1", play1);
    play.addImage("play2", play2);
    play.scale = 0.5;

    restart = createSprite(450, 310);
    restart.addImage("restart1", restart1);
    restart.addImage("restart2", restart2);
    restart.scale = 0.5;

    zombscore = createSprite(50, 75);
    zombscore.addImage("scoreImg", scoreImg);
    zombscore.scale = 0.2;
    zombscore.visible = false;
    zombieGroup = new Group();
    bulletGroup = new Group();
    bgsound.loop();
    obstacles();
}

function draw() {
    // Intro Page of the Game
    if (gameState == "intro") {
        background(bgintro);
        camera.position.x = 450;
        camera.position.y = 300;
        scoreImg.visible = false;
        score = 0;
        girl.visible = false;
        girl.x = 450;
        girl.y = 300;
        girl.velocityX = 0;
        ground1.visible = false;
        ground2.visible = false;
        restart.visible = false;
        zombscore.visible = false;
        play.visible = true;
        if (mouseWentDown("left") && mousePressedOver(play)) {
            play.changeImage("play2", play2);
        } else if (mouseWentUp("left") && mouseIsOver(play)) {
            play.changeImage("play1", play1);
            gameState = "play";
        }
    }

    // Play state of the game
    if (gameState == "play") {
        background(bgimg);
        zombscore.visible = true;
        zombscore.x = girl.x - 400;
        // zombscore.x = girl.x - 350;
        play.visible = false;
        girl.visible = true;
        // girl colliding with all the elements of obstacle array
        for (let cr of crates) {
            if (girl.collide(cr))
                girl.changeAnimation("girl_run", girl_run);
        }
        for (let ob of obs) {
            if (girl.collide(ob))
                girl.changeAnimation("girl_run", girl_run);
        }
        // following the camera position
        if (girl.y < 305) {
            camera.position.y = girl.y;
            zombscore.y = girl.y - 250;
        }
        camera.position.x = girl.x;
        // making the ground visible
        ground1.visible = true;
        ground2.visible = true;

        for (let zom of zomb) {
            if (zom.isTouching(bulletGroup)) {
                bulletGroup.destroyEach();
                dead.play();
                zom.remove();
                score++;
            }
        }

        controls();
        shoot();
        textSize(30);
        fill("Yellow");
        text("-  " + score, zombscore.x + 30, zombscore.y + 10);
    }
    drawSprites();
}

function controls() {
    girl.velocityX = 5;
    if (girl.collide(invisible_ground1) | girl.collide(invisible_ground2)) {
        girl.changeAnimation("girl_run", girl_run);
    }
    if (keyWentDown("space")) {
        girl.velocityY = -15;
    } else if (keyWentUp('space')) {
        girl.velocityY *= 0.5;
    }
    girl.velocityY++;

    if (girl.velocityY < 0)
        girl.changeImage("girl_jump1", girl_jump1);
    if (girl.velocityY > 1)
        girl.changeImage("girl_jump2", girl_jump2);
}

function obstacles() {
    // platform for zombies to stand on
    platform = createSprite(3000, 410);
    platform.addImage("platformImg", platformImg);
    obs.push(platform);

    // extra obstacles
    skeleton = createSprite(3500, 435);
    skeleton.addImage("skeltonimg", skeletonimg);
    skeleton.scale = 1.5;
    skeleton.setCollider("rectangle", 0, 0, 10, 10);
    obs.push(skeleton);

    // spawning zombies
    for (let i = 0; i < 5; i++) {
        zombie = createSprite(2830 + i * 75, 260);
        zombie.addAnimation("zombieImg", zombieImg);
        zombie.frameDelay = 2;
        zombie.scale = 0.375;
        zombie.setCollider('rectangle', 0, 0, 100, 450)
        zomb.push(zombie);
    }

    // creating a ramp out of crates
    for (let i = 0; i < 3; i++) {
        crate = createSprite(1050 + i * 300, 430 - i * 106);
        crate.addImage("crateimg", crateimg);
        crates.push(crate);
        for (let j = 0; j < i; j++) {
            crate = createSprite(1050 + i * 300, 430 - j * 106);
            crate.addImage("crateimg", crateimg);
            crates.push(crate);
        }
    }
    // tile floating above the deadly ditch
    floatingtile = createSprite(2200, 300);
    floatingtile.addImage("floatingtileImg", floatingtileImg);
    floatingtile.setCollider("rectangle", 0, -40, 400, 10);
    obs.push(floatingtile);
}


function shoot() {
    if (keyWentDown("l")) {
        gunsound.play();
        bullet = createSprite(girl.x, girl.y);
        bullet.addImage("bulletImg", bulletImg);
        bullet.velocityX = 10;
        bullet.lifetime = 100;
        girl.changeImage("girl_shoot", girl_shoot);
        bullet.depth = girl.depth;
        girl.depth++;
        bullet.setCollider('rectangle', -10, 0, 40, 18)
        bulletGroup.add(bullet);
    }
}
