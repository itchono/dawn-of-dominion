class Gameboard {
    constructor(mapdata) {
        this.canvas = document.createElement("canvas")
        // this.canvas.width = window.innerWidth * BOARD_SIZE_FACTOR;
        // this.canvas.height = window.innerHeight * BOARD_SIZE_FACTOR;

        this.canvas.width = 1280
        this.canvas.height = 720

        this.context = this.canvas.getContext("2d");

        var gamecontainer = document.getElementById("gamecontainer")
        gamecontainer.insertBefore(this.canvas, gamecontainer.childNodes[0]) // insert canvas
        this.interval = setInterval(draw, 20); // creates a routine to run the draw function

        this.canvas.onmousemove = mousepos;


        // Init buttons

        this.buttons = new Array(2)
        for (var grid = 0; grid < 2; grid++) {
            this.buttons[grid] = new Array(GRID_SIZE)
            for (var x = 0; x < GRID_SIZE; x++) {
                this.buttons[grid][x] = new Array(GRID_SIZE)
                for (var y = 0; y < GRID_SIZE; y++) { 
                    this.buttons[grid][x][y] = new Gamebutton(BUTTON_SIZE, BUTTON_SIZE, x, y, grid, mapdata["maps"][0]["terrain"][y][x])
                }
            }
        } 
    }

    draw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height); // clears the canvas for redraw
        for (var grid = 0; grid < 2; grid++) {
            for (var x = 0; x < GRID_SIZE; x++) {
                for (var y = 0; y < GRID_SIZE; y++) { 
                    this.buttons[grid][x][y].update()
                }
            }
        }
    }

}

class Component {
    constructor(w, h, color, x, y) {
        this.w = w;
        this.h = h;
        this.x = x;
        this.y = y;
        this.color = color;
    }

    get width() {
        return this.w*gameboard.canvas.width
    }

    get height() {
        return this.h*gameboard.canvas.height
    }

    get posx() {
        return (this.x)*gameboard.canvas.width
    }

    get posy() {
        return (this.y)*gameboard.canvas.height
    }

    update() {
        var ctx = gameboard.context;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.posx, this.posy, this.width, this.height);
    }

    click () {
        // empty
    }
}

class Gamebutton extends Component {
    constructor(w, h, indx, indy, team, terrain) {
        super(w, h, "grey", 0, 0);
        this.data = {
            team: team,
            indx: indx,
            indy: indy,
            revealed: false,
            unit: null,
            terrain: terrain,
            state: "empty"
        }
    }
    damage(unit) {
        // Damage the unit from an enemy attack
        var postmitigation = unit.ATK - this.data.unit.DEF

        if (postmitigation > 0) {

            console.log("Incoming Damage: " + unit.ATK + "\nTaken Damage: " + postmitigation)
            this.data.unit.CHP -= postmitigation

            if (this.data.unit.CHP < 0) {
                this.data.unit.CHP = 0
            }

        }   else {
            console.log("Incoming Damage: " + unit.ATK + "\nAll damage mitigated")
        }
        return postmitigation
    }


    update() {
        
        var ctx = gameboard.context;
        

        if (mouseX > this.posx && mouseX < this.posx+this.width && mouseY > this.posy && mouseY < this.posy+this.height) {
            
            if (mouseDown) {
                ctx.fillStyle = "darkgray"
            } else {
                ctx.fillStyle = "lightgray"
            }
        }
        else if (selectX == this.data.indx && selectY == this.data.indy && this.data.team == activeplayer) {
            ctx.fillStyle = "orange"
        }
        else if (this.data.state == "missed") {
            ctx.fillStyle = "white"
        }
        else if (tgtX == this.data.indx && tgtY == this.data.indy && this.data.team == 1-activeplayer) {
            ctx.fillStyle = "red"
        }
        else if (this.data.state == "occupied" && (this.data.revealed || this.data.team == activeplayer)){
            ctx.fillStyle = "rgb("+ Math.round(255 * (1-this.data.unit.CHP/this.data.unit.MHP)) + "," + Math.round(150 * (this.data.unit.CHP/this.data.unit.MHP)) + ",0)"
        }
        else {
            ctx.fillStyle = TERRAINCOLOUR[this.data.terrain]
        }
        
        ctx.fillRect(this.posx, 
                    this.posy, 
                    this.width, 
                    this.height);

        if (this.data.unit && (this.data.revealed || this.data.team == activeplayer)) {
            ctx.drawImage(spritemap[this.data.unit.id], this.posx, this.posy, this.width, this.height)
        }
    }

    get width() {
        // override
        return this.w*gameboard.canvas.height
    }

    get posx() {
        return (this.data.indx*BUTTON_STEP+INITIAL_X+(NEXT_GRID_START)*Math.abs(this.data.team-activeplayer))*gameboard.canvas.height
    }

    get posy() {
        return (this.data.indy*BUTTON_STEP+INITIAL_Y)*gameboard.canvas.height
    }

    click() {

        if (this.data.team == activeplayer) {

            if (turnnumber == 0) {
                if (this.data.state == "empty" && shop.selectedUNIT) {
                    this.data.state = "occupied"
                    this.data.unit = Object.assign(unitmap[shop.selectedUNIT])
                }
                
                else {
                    this.data.state = "empty"
                    this.data.unit = null
                }
            }

            else {
                if (this.data.team == activeplayer) {
                    selectX = this.data.indx
                    selectY = this.data.indy
                    
                    // toggle fire
                    if (this.data.unit && !fired) {
                        document.getElementById("fire").removeAttribute("disabled")
                    }
                    else {
                        document.getElementById("fire").setAttribute("disabled", "true")
                    }
                }

            }
            
        }
        else {
            tgtX = this.data.indx
            tgtY = this.data.indy
        }
        
    }
}


class Shop {
    constructor() {
        this.buttons = []
        this.selectedUNIT = null
    }

    draw() {
        for (i in this.buttons) {
            this.buttons[i].update()
        }
    }

    click() {
        for (i in this.buttons) {
            this.buttons[i].click()
        }
    }
}


class ShopItem extends Component {

    constructor(x, y, color, textcolor, unit) {

        super(60, 60, color, x, y);
        
        this.textcolor = textcolor
        this.unit = unit
    }

    update() {
        var ctx = gameboard.context;

        if (mouseX > this.posx && mouseX < this.posx+this.w && mouseY > this.posy && mouseY < this.posy+this.h) {
            ctx.fillStyle = "lightgreen"
        }
        else if (shop.selectedUNIT === this.unit.id) {
            ctx.fillStyle = "green"
        }
        else {
            ctx.fillStyle = this.color
        }
    
        ctx.fillRect(this.posx, this.posy, this.w, this.h)

        if (spritemap[this.unit.id]) {
            // wait for sprite to load
            ctx.drawImage(spritemap[this.unit.id], this.posx, this.posy, this.h, this.h)
        }
        ctx.fillStyle = this.textcolor
        ctx.font = "12px Arial";
        ctx.textAlign = "left"
        ctx.fillText(this.unit.cost, this.posx+this.w*1/10, this.posy + this.h*1/6);
    }

    click() {

        if (mouseX > this.posx && mouseX < this.posx+this.w && mouseY > this.posy && mouseY < this.posy+this.h) {
            shop.selectedUNIT = this.unit.id

            var st = this.unit.name + ": Cost = " + this.unit.cost + "<br>" + this.unit.description + "<br>HP: " + this.unit.MHP + "<br>ATK: " + this.unit.ATK  + " DEF: " + this.unit.DEF;;
            document.getElementById("infotext").innerHTML = st
        }
        
    }

}
