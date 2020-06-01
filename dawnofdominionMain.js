/* Dawn Of Dominion


Changelog

Version 0.1.1
2020/06/01-02

Version 0.1
2020/06/01
- Started the game
- Added button arrays
*/

var gamebuttons

var mouseX
var mouseY

var gameboard

var selectX
var selectY

var activeplayer = 0

function startGame() {
    
    document.addEventListener("click", click); // add event

    gameboard = new Gameboard();

    tx = new TextBx(0.2, 0.1, "Clicked on", "grey");

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
    
    document.addEventListener('keydown', function(event) {
        if(event.keyCode == 32) {
            activeplayer = 1-activeplayer;
        }
    });
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

        var st = "Hover: Grid" + Math.abs(activeplayer-grid) + " (" + indX + "," + indY + ")";

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

        var st = "Clicked on button " + Math.abs(activeplayer-grid) + "," + indX + "," + indY;

        tx.text = st
    }

    
}






 
