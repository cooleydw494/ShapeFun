//get the canvas and drawing context
var canvas = document.getElementById("canvasFun");
var ctx = canvas.getContext("2d");

//set canvas to window size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//add mouse object
var mouse = {
    "x": undefined,
    "y": undefined
};
//mousemove event to keep track of mouse pos.
window.addEventListener("mousemove", function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
    console.log(mouse);
}, false);

//declare circleArray and create click listener to make circles    
var circleArray = [];
window.addEventListener("click", makeNewCircle, false);

//set radiusMin, radiusRange, collisionRadius, and velocity/expansion multipliers
var radiusMin = 2;
var radiusRange = 2;
var collisionRadius = 60;
var velMultiplier = 2;
var expandMultiplier = 8;

//instantiate color palettes
var darkBluesPalette = ["#779589", "#151d4e", "#125b54", "#0a2427", "#161327", "white"];
var salmonPalette = ["#7b1f1f", "#995252", "#135d3b", "#c05b5b", "#444040", "white"];
var usaPalette = ["#cc092f", "#919693", "#ded5b3", "#1a4663", "#003050", "white"];

//animate loop
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //update every circle in circleArray
    for (i = 0; i < circleArray.length; i++) {
        circleArray[i].update();
    }
}
//start animation
animate();
//start with 100 circles
for (i = 0; i < 699; i++) {
    makeNewCircle(salmonPalette);
}




//FUNCTIONS##########################

//circle "class" constructor
function Circle(x, y, dx, dy, r, color, fillColor) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.r = r;
    this.baseRadius = r;
    //draw circle method
    this.draw = function () {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.arc(x, y, r, 0, Math.PI * 2, false);
        ctx.fillStyle = fillColor;
        ctx.fill();
        ctx.stroke();
    };
    //update circle method
    this.update = function () {
        //check for wall collision / bounce
        if (x >= (canvas.width - r) || x <= r) {
            dx = -dx;
        }
        if (y >= (canvas.height - r) || y <= r) {
            dy = -dy;
        }
        //update velocity
        x += dx;
        y += dy;
        //update radius to shrink/grow based on mouse pos.
        //if mouse is within collision radius
        if (x - mouse.x < collisionRadius && x - mouse.x > -collisionRadius
            && y - mouse.y < collisionRadius && y - mouse.y > -collisionRadius) {
            if (r < expandMultiplier * this.baseRadius) {
                r += 1;
            }
        }
        else if (r > this.baseRadius) {
            r -= 1;
        }
        //draw
        this.draw();
    };
}

//make a new circle using circle "class" constructor and rand vals
function makeNewCircle(colorPalette) {
    //from radiusMin up to (radiusMin + radiusRange)
    var r = Math.random() * radiusRange + radiusMin;
    var x = Math.random() * (canvas.width - (2 * r)) + r;
    var dx = (Math.random() - 0.5) * velMultiplier;
    var y = Math.random() * (canvas.height - (2 * r)) + r;
    var dy = (Math.random() - 0.5) * velMultiplier;
    var color = randColor(colorPalette), fillColor = randColor(colorPalette);
    circleArray.push(new Circle(x, y, dx, dy, r, color, fillColor));
}

//generate and return random color
function randColor(colorPalette) {
    //random index from 0 to last array index
    var index = (Math.floor(Math.random() * colorPalette.length));
    return colorPalette[index];
}