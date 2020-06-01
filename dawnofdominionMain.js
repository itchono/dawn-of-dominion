/* Dawn Of Dominion


Changelog

Version 0.1
2020/06/01
- Started the game
- Added button arrays
*/

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




 
