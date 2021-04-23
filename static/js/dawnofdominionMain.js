/* Dawn Of Dominion


Changelog

Version 0.3
2021/04/20
- Fixed scrolling issues
- Everything is on Flask now!

Version 0.2.1
2021/04/15
- Hiding Images
- Added click aesthetics

Version 0.2
2020/06/02
- Very basic turn strategy added
- Image assets for units added
- Very basic shop system added
- Placing units down works
- Firing works, with hit detection

Version 0.1
2020/06/01
- Started the game
- Added button arrays
*/


// CONSTANTS
const BOARD_SIZE_FACTOR = 0.75
const BUTTON_SIZE = 0.08
const BUTTON_PADDING = 0.005
const GRID_SIZE = 7
const BUTTON_STEP = BUTTON_PADDING + BUTTON_SIZE
const GRID_SPACE = 0.2

const NEXT_GRID_START = GRID_SPACE+GRID_SIZE*BUTTON_STEP

const INITIAL_X = 0.12
const INITIAL_Y = 0.2

var remainingunits = 5 // TODO implement

var mouseX
var mouseY

// Board components
var gameboard
var shop
var showshop = false

// combat
var selectX
var selectY

var tgtX
var tgtY

var activeplayer = 0
var turnnumber = 0

// Unit Data Store
var spritemap = {}
var units = {}

function startGame(gamedata) {

    console.log(gamedata)

    shop = new Shop();

    for (i in gamedata) {
        var image = new Image()
        image.src = "data:image/png;base64," + gamedata[i].sprite

        // populate sprite map and unit dictionary
        spritemap[gamedata[i].id] = image
        units[gamedata[i].id] = gamedata[i]

        // add shop buttons
        shop.buttons = shop.buttons.concat(new ShopItem(0.85 + Math.floor(i/8) * 0.05, 0.1 + 0.1 * (i % 8), "#3c3c3c", "orange", gamedata[i]))
    }

    document.addEventListener("click", click); // add event

    gameboard = new Gameboard();
    
    
    document.addEventListener('keydown',keydown)
}

function draw() {
    gameboard.draw()

    if (showshop) {
        shop.draw()
    }
}

function mousepos(e){
    var relX = e.clientX - gameboard.canvas.offsetLeft - INITIAL_X*gameboard.canvas.height + window.scrollX
    var relY = e.clientY- gameboard.canvas.offsetTop - INITIAL_Y*gameboard.canvas.height + window.scrollY

    mouseX = e.clientX - gameboard.canvas.offsetLeft + window.scrollX
    mouseY = e.clientY- gameboard.canvas.offsetTop + window.scrollY

    var grid = 0;

    if (relX > NEXT_GRID_START*gameboard.canvas.height) {
        grid = 1;
        relX -= NEXT_GRID_START*gameboard.canvas.height
    }

    var indX = Math.floor(relX/(BUTTON_STEP*gameboard.canvas.height))
    var indY = Math.floor(relY/(BUTTON_STEP*gameboard.canvas.height))

    if (indX >= 0 && indX < GRID_SIZE && indY >= 0 && indY < GRID_SIZE) {
        // Grid Stats

        var cell = gameboard.buttons[Math.abs(activeplayer-grid)][indX][indY]

        var st = "Current Square: Grid " + Math.abs(activeplayer-grid) + " (" + indX + "," + indY + ")";

        if (cell.unit && (cell.revealed || cell.team == activeplayer)) {
            st += "<br>" + cell.unit.name + ": Current HP = " + cell.unit.CHP + "<br>" + cell.unit.description;
        }

        document.getElementById("infotext").innerHTML = st
    }
}

function click(e)  {
    // handles clicking of a button
    var relX = e.clientX - gameboard.canvas.offsetLeft - INITIAL_X*gameboard.canvas.height + window.scrollX
    var relY = e.clientY- gameboard.canvas.offsetTop - INITIAL_Y*gameboard.canvas.height + window.scrollY

    var grid = 0;

    if (relX > NEXT_GRID_START*gameboard.canvas.height) {
        grid = 1;
        relX -= NEXT_GRID_START*gameboard.canvas.height
    }

    var indX = Math.floor(relX/(BUTTON_STEP*gameboard.canvas.height))
    var indY = Math.floor(relY/(BUTTON_STEP*gameboard.canvas.height))

    if (indX >= 0 && indX < GRID_SIZE && indY >= 0 && indY < GRID_SIZE) {
        gameboard.buttons[Math.abs(activeplayer-grid)][indX][indY].click()
    }

    if (showshop) {
        shop.click()
    }
}

function keydown(event) {
    if(event.keyCode == 32) {
        nextturn()
    }
}

// mouse down detection
var mouseDown = 0;
document.body.onmousedown = function() { 
  ++mouseDown;
}
document.body.onmouseup = function() {
  --mouseDown;
}





 
