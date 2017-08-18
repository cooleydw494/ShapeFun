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
var shapeStack = [];
window.addEventListener("click", makeNewCircle, false);

//set radius and side mins/ranges, collisionRadius, and velocity/expansion multipliers
var radiusMin = 2;
var radiusRange = 2;
var squareSideMin = 3;
var squareSideRange = 3;
var collisionRadius = 60;
var velMultiplier = 2;
var expandMultiplier = 8;

//instantiate color palettes
var darkBluesPalette = ["#779589", "#151d4e", "#125b54", "#0a2427", "#161327"];
var salmonPalette = ["#7b1f1f", "#995252", "#135d3b", "#c05b5b", "#444040"];
var usaPalette = ["#cc092f", "#919693", "#ded5b3", "#1a4663", "#003050"];
var oldSchoolPalette = ["#8C8619", "#BDB262", "BD8F24", "#A62E16", "#300906", "#8C8619", "#BDB262", "#BD8F24"];

//prompt user for shapeType, shapeNumber, and colorPalette
var shapeType = prompt("Choose a shape type, 'circle' or 'square'", "circle");
var shapeNumber = prompt("How many shapes do you want to make?", 500);
var colorPalettePrompt = prompt("Choose a color palette, either 'salmon', 'dark blues', 'usa', or 'old school'", "dark blues");
switch (colorPalettePrompt) {
    case "salmon":
        colorPalette = salmonPalette;
        break;
    case "dark blues":
        colorPalette = darkBluesPalette;
        break;
    case "usa":
        colorPalette = usaPalette;
        break;
    case "old school":
        colorPalette = oldSchoolPalette;
        break;
    default:
        colorPalette = usaPalette;
        break;
}

//start animation
animate();

//add shapes
addShapes();


//FUNCTIONS##########################

//animate loop
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //update every circle in circleArray
    for (i = 0; i < shapeStack.length; i++) {
        shapeStack[i].update();
    }
}

//add shapes function
function addShapes() {
    var shapeFunc;
    //pick the correct shape function
    switch(shapeType) {
        case "circle":
            shapeFunc = makeNewCircle;
            break;
        case "square":
            shapeFunc = makeNewSquare;
            break;
    }
    //make the shapes
    for (i = 0; i < shapeNumber; i++) {
        shapeFunc(colorPalette);
    }
}

//circle "class" constructor
function Circle(x, y, dx, dy, r, color, fillColor) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.r = r;
    var baseRadius = r;
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
            //check if radius isn't max size we want
            if (r < expandMultiplier * baseRadius) {
                r += 1;
            }
        }
        else if (r > baseRadius) {
            r -= 1;
        }
        //draw
        this.draw();
    };
}

//square class "constructor" message
function Square(x, y, dx, dy, side, color, fillColor) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.side = side;
    var baseSide = side;
    //square draw function
    this.draw = function() {
        ctx.fillStyle = fillColor;
        ctx.strokeStyle = color;
        ctx.fillRect(x, y, side, side);
        ctx.stroke();
    };
    //update square method
    this.update = function() {
        //check for collision/bounce
        if (x <= 0 || x >= canvas.width - side) {
            dx = -dx;
        }
        if (y <= 0 || y >= canvas.height - side) {
            dy = -dy;
        }
        //update position
        x += dx;
        y += dy;
        //find center of square
        var xCenter = x + (side / 2);
        var yCenter = y + (side / 2);
        //update side to shrink/grow when collison with mouse
        //if mouse if within collision radius
        if (xCenter - mouse.x < collisionRadius && mouse.x - xCenter < collisionRadius && yCenter - mouse.y < collisionRadius && mouse.y - yCenter < collisionRadius) {
            if (side < expandMultiplier * baseSide) {
                side += 1;
            }
        }
        else {
            if (side > baseSide) {
                side -= 1;
            }
        }
        //call draw function
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
    shapeStack.push(new Circle(x, y, dx, dy, r, color, fillColor));
}

//make a new square using square class constructor
function makeNewSquare(colorPalette) {
    var side = Math.random() * squareSideRange + squareSideMin;
    var x = Math.random() * (canvas.width - side);
    var dx = (Math.random() - 0.5) * velMultiplier;
    var y = Math.random() * (canvas.width - side);
    var dy = (Math.random() - 0.5) * velMultiplier;
    var color = randColor(colorPalette), fillColor = randColor(colorPalette);
    shapeStack.push(new Square(x, y, dx, dy, side, color, fillColor));
}

//generate and return random color
function randColor(colorPalette) {
    //random index from 0 to last array index
    var index = (Math.floor(Math.random() * colorPalette.length));
    return colorPalette[index];
}