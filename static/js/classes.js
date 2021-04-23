class Gameboard {
    constructor() {
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
            this.buttons[grid] = new Array(6)
            for (var x = 0; x < GRID_SIZE; x++) {
                this.buttons[grid][x] = new Array(6)
                for (var y = 0; y < GRID_SIZE; y++) { 
                    this.buttons[grid][x][y] = new Gamebutton(BUTTON_SIZE, BUTTON_SIZE, "grey", x, y, grid)
                }
            }
        } 
    }

    draw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height); // clears the canvas for redraw
        for (var grid = 0; grid < 2; grid++) {
            for (var x = 0; x < 6; x++) {
                for (var y = 0; y < 6; y++) { 
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
    constructor(w, h, color, indx, indy, team) {
        super(w, h, color, 0, 0);
        this.team = team;
        this.indx = indx;
        this.indy = indy;

        this.revealed = false
        this.unit = null

        this.state = "empty"
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
        else if (selectX == this.indx && selectY == this.indy && this.team == activeplayer) {
            ctx.fillStyle = "green"
        }
        
        else if (this.state == "clicked" && (this.revealed || this.team == activeplayer)){
            ctx.fillStyle = "rgb("+ Math.round(255 * (1-this.unit.CHP/this.unit.MHP)) + "," + Math.round(255 * (this.unit.CHP/this.unit.MHP)) + ",0)"
        }
        else if (tgtX == this.indx && tgtY == this.indy && this.team == 1-activeplayer) {
            ctx.fillStyle = "red"
        }
        else {
            ctx.fillStyle = this.color;
        }
        
        ctx.fillRect(this.posx, 
                    this.posy, 
                    this.width, 
                    this.height);

        if (this.unit && (this.revealed || this.team == activeplayer)) {
            ctx.drawImage(spritemap[this.unit.id], this.posx, this.posy, this.width, this.height)
        }
    }

    get width() {
        // override
        return this.w*gameboard.canvas.height
    }

    get posx() {
        return (this.indx*BUTTON_STEP+INITIAL_X+(NEXT_GRID_START)*Math.abs(this.team-activeplayer))*gameboard.canvas.height
    }

    get posy() {
        return (this.indy*BUTTON_STEP+INITIAL_Y)*gameboard.canvas.height
    }

    click() {

        if (this.team == activeplayer) {

            if (turnnumber == 0) {
                if (this.state == "empty" && shop.selectedUNIT) {
                    this.state = "clicked"
                    this.unit = Object.create(units[shop.selectedUNIT])
                }
                
                else {
                    this.state = "empty"
                    this.unit = ""
                }
            }

            else {
                if (this.team == activeplayer) {
                    selectX = this.indx
                    selectY = this.indy
                }

            }
            
        }
        else {
            tgtX = this.indx
            tgtY = this.indy
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
        }
        
    }

}
