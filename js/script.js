//SET UP THE CANVAS
var canvas = document.getElementById("canvasFun");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth; //fit to window
canvas.height = window.innerHeight; //fit to window

//ALWAYS KEEP TRACK OF MOUSE POSITION
var mouse = {
    "x": undefined,
    "y": undefined
};
window.addEventListener("mousemove", function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
}, false);

//GRAB HTML GUI ELEMENTS
var submitButton = document.getElementById("submitButton");
var clearButton = document.getElementById("clearButton");
var shapeTypeField = document.getElementById("shapeType");
var shapeNumberField = document.getElementById("shapeNumber");
var colorPaletteField = document.getElementById("colorPalette");
var backgroundColorField = document.getElementById("backgroundColor");

//DECLARE ALL CONTROL/GLOBAL VARIABLES
var radiusMin = 2; //minimum radius of a circle
var radiusRange = 2; //added range to the minimum radius of a circle
var squareSideMin = 3; //minimum side length for a square
var squareSideRange = 3; //added range to minimum side length of a square
var collisionRadius = 60; //mouse collision radius for any shape of any size
var velMultiplier = 2; //factor by which to multiply rand velocity of -.5 to .5
var expandMultiplier = 8; //factor by which to multiply expandability of shapes past their base sizes
var shapeStack = []; //array to hold all shapes to be animated/updated/drawn

//INSTANTIATE COLOR PALETTES AS ARRAYS
var darkBluesPalette = ["#779589", "#151d4e", "#125b54", "#0a2427", "#161327"];
var salmonPalette = ["#7b1f1f", "#995252", "#135d3b", "#c05b5b", "#444040"];
var usaPalette = ["#cc092f", "#919693", "#ded5b3", "#1a4663", "#003050"];
var oldSchoolPalette = ["#8C8619", "#BDB262", "BD8F24", "#A62E16", "#300906", "#8C8619", "#BDB262", "#BD8F24"];

//START ANIMATION
animate();

//EVENT LISTENER FOR addShapes, clearShapes, backgroundColor, and resize
submitButton.addEventListener("click", addShapes, false);
clearButton.addEventListener("click", clearShapes, false);
backgroundColorField.addEventListener("change", setBackground, false);
window.addEventListener("resize", resizeCanvas, false);

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
    var shapeType = shapeTypeField.value;
    var shapeNumber = shapeNumberField.value;
    var colorPalette = parseColorPalette(colorPaletteField.value);
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

//clear shapes from canvas
function clearShapes() {
    shapeStack = [];
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
//        ctx.stroke();
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
function Square(x, y, dx, dy, side, fillColor) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.side = side;
    var baseSide = side;
    //square draw function
    this.draw = function() {
        ctx.fillStyle = fillColor;
        ctx.fillRect(x, y, side, side);
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
    var fillColor = randColor(colorPalette);
    shapeStack.push(new Square(x, y, dx, dy, side, fillColor));
}

//PARSE COLOR PALETTE STRING TO GET CORRECT ARRAY
function parseColorPalette(colorPaletteString) {
    switch (colorPaletteString) {
    case "Salmon":
        return salmonPalette;
    case "Dark Blues":
        return darkBluesPalette;
    case "USA Cola":
        return usaPalette;
    case "Old School":
        return oldSchoolPalette;
    default:
        return usaPalette;
    }
}

//generate and return random color
function randColor(colorPalette) {
    //random index from 0 to last array index
    var index = (Math.floor(Math.random() * colorPalette.length));
    return colorPalette[index];
}

//change background color
function setBackground() {
    var color = backgroundColorField.value;
    canvas.style.backgroundColor = color;
}

//check if shapes are off screen on resize and move them on screen
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}