//get the canvas and drawing context
var canvas = document.getElementById("canvasFun");
var ctx = canvas.getContext("2d");

//set canvas to window size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//declare circleArray and create click listener to make circles    
var circleArray = [];
window.addEventListener("click", makeNewCircle, false);

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

//circle constructor
function Circle(x, y, dx, dy, r, color) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.r = r;
    //draw circle
    this.draw = function () {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.arc(x, y, r, 0, Math.PI * 2, false);
        ctx.stroke();
    };
    //update circle
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
        //draw
        this.draw();
    };
}

//make a new circle using circle constructor and rand vals
function makeNewCircle() {
    var r = Math.random() * 50 + 50;
    var x = Math.random() * (canvas.width - (2 * r)) + r;
    var dx = (Math.random() - 0.5) * 10;
    var y = Math.random() * (canvas.height - (2 * r)) + r;
    var dy = (Math.random() - 0.5) * 10;
    var randColor;
    switch (Math.floor(Math.random() * 10)) {
        case 1: randColor = "red";
            break;
        case 2: randColor = "blue";
            break;
        case 3: randColor = "green";
            break;
        case 4: randColor = "purple";
            break;
        case 5: randColor = "orange";
            break;
        case 6: randColor = "pink";
            break;
        case 7: randColor = "yellow";
            break;
        case 8: randColor = "brown";
            break;
        case 9: randColor = "black";
            break;
        default: randColor = "black";
    }
    circleArray.push(new Circle(x, y, dx, dy, r, randColor));
}