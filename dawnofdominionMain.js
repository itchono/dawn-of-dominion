/* Dawn Of Dominion


Changelog

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

var remainingunits = 5 // TODO implement

var mouseX
var mouseY

var gameboard
var gamebuttons
var nextbutton

// combat
var selectX
var selectY

var tgtX
var tgtY

// shopping
var selectedUNIT = ""

var activeplayer = 0

var turnnumber = 0

function startGame() {


    
    document.addEventListener("click", click); // add event

    gameboard = new Gameboard();

    tx = new TextBx(0.5, 0.9, "Current Square: ", "grey");
    statustxt = new TextBx(0.15, 0.1, "Turn 1: Placing Units", "grey");
    turntxt = new TextBx(0.15, 0.15, "Player 1's Turn", "grey");

    nextbutton = new UIButton(0.06, 0.04, 0.3, 0.1, "Next Turn", "darkgrey", "black", nextturn)
    firebutton = new UIButton(0.06, 0.04, 0.4, 0.1, "FIRE", "darkgrey", "black", fire)

    equanosbutton = new ShopItem(0.06, 0.08, 0.9, 0.3, "1200", "darkgrey", "black", "equanosship")
    equanosbutton2 = new ShopItem(0.06, 0.08, 0.9, 0.4, "800", "darkgrey", "black", "equanostank")

    gamebuttons = new Array(2)
    for (var grid = 0; grid < 2; grid++) {
        gamebuttons[grid] = new Array(6)
        for (var x = 0; x < GRID_SIZE; x++) {
            gamebuttons[grid][x] = new Array(6)
            for (var y = 0; y < GRID_SIZE; y++) { 
                gamebuttons[grid][x][y] = new Gamebutton(BUTTON_SIZE, BUTTON_SIZE, "grey", x, y, grid)
            }
        }
    } 
    
    document.addEventListener('keydown',keydown)
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
    nextbutton.update()
    statustxt.update()
    turntxt.update()
    firebutton.update()

    equanosbutton.update()
    equanosbutton2.update()
}

function mousepos(e){
    var relX = e.clientX - gameboard.canvas.offsetLeft - INITIAL_X*gameboard.canvas.height
    var relY = e.clientY- gameboard.canvas.offsetTop - INITIAL_Y*gameboard.canvas.height

    mouseX = e.clientX - gameboard.canvas.offsetLeft
    mouseY = e.clientY- gameboard.canvas.offsetTop

    var grid = 0;

    if (relX > NEXT_GRID_START*gameboard.canvas.height) {
        grid = 1;
        relX -= NEXT_GRID_START*gameboard.canvas.height
    }

    var indX = Math.floor(relX/(BUTTON_STEP*gameboard.canvas.height))
    var indY = Math.floor(relY/(BUTTON_STEP*gameboard.canvas.height))

    if (indX >= 0 && indX < GRID_SIZE && indY >= 0 && indY < GRID_SIZE) {

        var st = "Current Square: Grid " + Math.abs(activeplayer-grid) + " (" + indX + "," + indY + ")";

        tx.text = st
    }
}

function click(e)  {
    // handles clicking of a button
    var relX = e.clientX - INITIAL_X*gameboard.canvas.height - gameboard.canvas.offsetLeft;
    var relY = e.clientY - INITIAL_Y*gameboard.canvas.height - gameboard.canvas.offsetTop;

    var grid = 0;

    if (relX > NEXT_GRID_START*gameboard.canvas.height) {
        grid = 1;
        relX -= NEXT_GRID_START*gameboard.canvas.height
    }

    var indX = Math.floor(relX/(BUTTON_STEP*gameboard.canvas.height))
    var indY = Math.floor(relY/(BUTTON_STEP*gameboard.canvas.height))

    if (indX >= 0 && indX < GRID_SIZE && indY >= 0 && indY < GRID_SIZE) {
        gamebuttons[Math.abs(activeplayer-grid)][indX][indY].click()

        // var st = "Clicked on button: Grid " + Math.abs(activeplayer-grid) + " (" + indX + "," + indY + ")";

    }
    nextbutton.click()

    firebutton.click()

    equanosbutton.click()
    equanosbutton2.click()

    
}

function keydown(event) {
    if(event.keyCode == 32) {
        nextturn()
    }
}






 
