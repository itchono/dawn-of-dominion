/* Dawn Of Dominion


Changelog

Version 0.1
2020/06/01
- Started the game
- Added button arrays
*/

const BOARD_SIZE_FACTOR = 0.75
const BUTTON_SIZE = 40
const BUTTON_PADDING = 5
const GRID_SIZE = 6
const BUTTON_STEP = BUTTON_PADDING + BUTTON_SIZE
const GRID_SPACE = 100

const NEXT_GRID_START = GRID_SPACE+GRID_SIZE*BUTTON_STEP

const INITIAL_X = 50
const INITIAL_Y = 200


var gamebuttons

var mouseX
var mouseY

var gameboard

function startGame() {
    document.onmousemove = mousepos;
    document.addEventListener("click", click); // add event

    gameboard = new Gameboard();

    tx = new TextBx(300, 100, "CLicked on", "grey");

    gamebuttons = new Array(2)
    for (var grid = 0; grid < 2; grid++) {
        gamebuttons[grid] = new Array(6)
        for (var x = 0; x < GRID_SIZE; x++) {
            gamebuttons[grid][x] = new Array(6)
            for (var y = 0; y < GRID_SIZE; y++) { 
                gamebuttons[grid][x][y] = new Gamebutton(BUTTON_SIZE, BUTTON_SIZE, "grey", x*BUTTON_STEP+INITIAL_X+(NEXT_GRID_START)*grid, y*BUTTON_STEP+INITIAL_Y, grid)
            }
        }
    }  
}

function draw() {
    gameboard.clear()
    for (var grid = 0; grid < 2; grid++) {
        for (var x = 0; x < 6; x++) {
            for (var y = 0; y < 6; y++) { 
                gamebuttons[grid][x][y].update()
            }
        }
    }
    tx.update()

}

function mousepos(e){
    mouseX = e.clientX
    mouseY = e.clientY
}

function click(e)  {
    var relX = e.clientX - INITIAL_X;
    var relY = e.clientY - INITIAL_Y;

    var grid = 0;

    if (relX > NEXT_GRID_START) {
        grid = 1;
        relX -= NEXT_GRID_START
    }

    var indX = Math.floor(relX/BUTTON_STEP)
    var indY = Math.floor(relY/BUTTON_STEP)

    if (indX >= 0 && indX < GRID_SIZE && indY >= 0 && indY < GRID_SIZE) {

        if (gamebuttons[grid][indX][indY].team == 0) {
            gamebuttons[grid][indX][indY].color = "CORNFLOWERBLUE"
        }
        else {
            gamebuttons[grid][indX][indY].color = "ORANGERED"
        }
    }

    var st = "Clicked on button " + grid + "," + indX + "," + indY;

    tx.text = st

    console.log(st)

}

class Gameboard {
    constructor() {
        this.canvas = document.createElement("canvas")
        this.canvas.width = window.innerWidth * BOARD_SIZE_FACTOR;
        this.canvas.height = window.innerHeight * BOARD_SIZE_FACTOR;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]); // put the canvas into our document
        this.interval = setInterval(draw, 20); // creates a routine to run the draw function
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height); // clears the canvas for redraw
    }

}

class Component {
    constructor(width, height, color, x, y) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.color = color;
    }

    update() {
        var ctx = gameboard.context;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Gamebutton extends Component {
    constructor(width, height, color, x, y, team) {
        super(width, height, color, x, y);
        this.team = team;
    }
    update() {
        
        var ctx = gameboard.context;
        

        if (mouseX > this.x && mouseX < this.x+this.width && mouseY > this.y && mouseY < this.y+this.height) {
            
            ctx.fillStyle = "gold"
        }
        else{
            ctx.fillStyle = this.color;
        }
        
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class TextBx extends Component {
    constructor(x, y, text, color) {
        super(0, 0, color, x, y);
        this.text = text;
    }

    update() {
        
        var ctx = gameboard.context;
        ctx.fillStyle = this.color
        ctx.font = "30px Roboto";
        ctx.fillText(this.text, this.x, this.y);
    }

}
 
