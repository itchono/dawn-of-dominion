// Dawn Of Dominion

// CONSTANTS
const BOARD_SIZE_FACTOR = 0.75
const BUTTON_SIZE = 0.08
const BUTTON_PADDING = 0.005
const GRID_SIZE = 7
const BUTTON_STEP = BUTTON_PADDING + BUTTON_SIZE
const GRID_SPACE = 0.2

const NEXT_GRID_START = GRID_SPACE+GRID_SIZE*BUTTON_STEP

const INITIAL_X = 0.12
const INITIAL_Y = 0.15
const TERRAINCOLOUR = ["MediumSeaGreen", "DodgerBlue"]

// Globals
var mouseX
var mouseY
var gameID

// Board components
var gameboard
var shop
var showshop = false

// combat
var selectX
var selectY
var fired = false

var tgtX
var tgtY

var activeplayer = 0
var turnnumber = 0

// Unit Data Store
var spritemap = {}
var unitmap = {}
var upgrademap = {}

// Start the Game
function startGame(unitdata, upgradedata, mapdata, in_spritemap, id) {

    console.log(unitdata);
    unitdata.sort((a, b) => (a.cost > b.cost) ? 1 : -1); // sort data

    gameID = id

    shop = new Shop();

    for (i in unitdata) {
        var image = new Image()
        image.src = "data:image/png;base64," + in_spritemap[unitdata[i].id]

        // populate sprite map and unit dictionary
        spritemap[unitdata[i].id] = image
        unitmap[unitdata[i].id] = unitdata[i]

        if (unitdata[i].multiX && unitdata[i].multiY) {
            for (k=0; k<unitdata[i].multiX*unitdata[i].multiY; k++) {
                var image = new Image()
                image.src = "data:image/png;base64," + in_spritemap[unitdata[i].id + (k+1)]
                spritemap[unitdata[i].id + (k+1)] = image
            }
        } 
    }

    for (i in upgradedata) {
        var image = new Image()
        image.src = "data:image/png;base64," + in_spritemap[upgradedata[i].id]
        // populate sprite map and upgrade dictionary
        spritemap[upgradedata[i].id] = image
        upgrademap[upgradedata[i].id] = upgradedata[i]
    }

    shop = new Shop(unitdata, upgradedata)
    shop.buildUnits()
    gamecontainer = document.getElementById("gamecontainer")
    gameboard = new Gameboard(mapdata);
    
    document.addEventListener('keydown',keydown)
}

// Called 20x Per Second
function draw() {
    gameboard.draw()

    if (showshop) {
        shop.draw()
    }
}


function mousepos(e){
    var [relX, relY] = relcoords(e)
    updatemousecoords(e)
    
    var grid = 0;
    if (relX > NEXT_GRID_START*gameboard.canvas.height) {
        grid = 1;
        relX -= NEXT_GRID_START*gameboard.canvas.height
    }

    var [indX, indY] = indcoords(relX, relY)

    if (indX >= 0 && indX < GRID_SIZE && indY >= 0 && indY < GRID_SIZE) {
        // Grid Stats
        var cell = gameboard.buttons[Math.abs(activeplayer-grid)][indX][indY]
        var st = "Current Square: Grid " + Math.abs(activeplayer-grid) + " (" + indX + "," + indY + ")";

        if (cell.data.unit && (cell.data.revealed || cell.data.team == activeplayer)) {
            var unit = cell.data.unit

            st += "<br>" + unit.name + ": " + unit.description + "<br>HP: "  + unit.CHP + "/" + unit.MHP + "<br>ATK: " + unit.ATK  + " DEF: " + unit.DEF;
        }

        document.getElementById("infotext").innerHTML = st
    }
}


