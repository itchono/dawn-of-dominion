// Mouse Events File

// mouse down detection
var mouseDown = 0;
document.body.onmousedown = function() { 
  ++mouseDown;
}
document.body.onmouseup = function() {
  --mouseDown;
}


// handles clicking of a button
function click(e)  {
    
    var [relX, relY] = relcoords(e)
    
    var grid = 0;

    if (relX > NEXT_GRID_START*gameboard.canvas.height) {
        grid = 1;
        relX -= NEXT_GRID_START*gameboard.canvas.height
    }

    var [indX, indY] = indcoords(relX, relY)

    if (indX >= 0 && indX < GRID_SIZE && indY >= 0 && indY < GRID_SIZE) {
        gameboard.buttons[Math.abs(activeplayer-grid)][indX][indY].click()
    }

    if (showshop) {
        shop.click()
    }

    // update mouseover
    mousepos(e)
}

function keydown(event) {
    if(event.keyCode == 32) {
        nextturn()
    }
} 

function relcoords(e) {
    // return relative coordinates of mouse
    var relX = e.clientX - gameboard.canvas.offsetLeft - INITIAL_X*gameboard.canvas.height + window.scrollX - gamecontainer.offsetLeft
    var relY = e.clientY- gameboard.canvas.offsetTop - INITIAL_Y*gameboard.canvas.height + window.scrollY - gamecontainer.offsetTop
    return [relX, relY]
}

function updatemousecoords(e) {
    mouseX = e.clientX - gameboard.canvas.offsetLeft + window.scrollX - gamecontainer.offsetLeft
    mouseY = e.clientY- gameboard.canvas.offsetTop + window.scrollY - gamecontainer.offsetTop
}

function indcoords(relX, relY) {
    // grid indices given relX and relY coordinates
    var indX = Math.floor(relX/(BUTTON_STEP*gameboard.canvas.height))
    var indY = Math.floor(relY/(BUTTON_STEP*gameboard.canvas.height))
    return [indX, indY]
}



document.addEventListener("click", click); // add event
