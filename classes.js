class Gameboard {
    constructor() {
        this.canvas = document.createElement("canvas")
        // this.canvas.width = window.innerWidth * BOARD_SIZE_FACTOR;
        // this.canvas.height = window.innerHeight * BOARD_SIZE_FACTOR;

        this.canvas.width = 1280
        this.canvas.height = 720

        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]); // put the canvas into our document
        this.interval = setInterval(draw, 20); // creates a routine to run the draw function

        this.canvas.onmousemove = mousepos;
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height); // clears the canvas for redraw
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
        this.unitID = ""

        this.state = "empty"
    }
    update() {
        
        var ctx = gameboard.context;
        

        if (mouseX > this.posx && mouseX < this.posx+this.width && mouseY > this.posy && mouseY < this.posy+this.height) {
            ctx.fillStyle = "gold"
        }
        else if (selectX == this.indx && selectY == this.indy && this.team == activeplayer) {
            ctx.fillStyle = "green"
        }
        else if (tgtX == this.indx && tgtY == this.indy && this.team == 1-activeplayer) {
            ctx.fillStyle = "red"
        }
        else if (this.state == "clicked" && (this.revealed || this.team == activeplayer)){
            ctx.fillStyle = TEAM_COLOURS[Math.abs(this.team-activeplayer)]
        }
        else {
            ctx.fillStyle = this.color;
        }
        
        ctx.fillRect(this.posx, 
                    this.posy, 
                    this.width, 
                    this.height);

        if (this.unitID != "" && (this.revealed || this.team == activeplayer)) {
            ctx.drawImage(document.getElementById(this.unitID), this.posx, this.posy, this.width, this.height)
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

                if (this.state == "empty" && selectedUNIT != "") {
                    this.state = "clicked"
                    this.unitID = selectedUNIT
                }
                else {
                    this.state = "empty"
                    this.unitID = ""
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

class UIButton extends Component {
    constructor(w, h, x, y, text, color, textcolor, clickfunc) {
        super(w, h, color, x, y);
        this.text = text;
        this.clickfunc = clickfunc
        this.textcolor = textcolor
    }

    update() {
        var ctx = gameboard.context;

        if (mouseX > this.posx && mouseX < this.posx+this.width && mouseY > this.posy && mouseY < this.posy+this.height) {
            ctx.fillStyle = "white"
        }
        else {
            ctx.fillStyle = this.color
        }
    
        ctx.fillRect(this.posx, this.posy, this.width, this.height)
        ctx.fillStyle = this.textcolor
        ctx.font = "12px Arial";
        ctx.fillText(this.text, this.posx+this.width/2, this.posy + this.height*2/3);
    }

    click() {

        if (mouseX > this.posx && mouseX < this.posx+this.width && mouseY > this.posy && mouseY < this.posy+this.height) {
            
            this.clickfunc()
        }
        
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
        ctx.textAlign = "center"
        ctx.font = "30px Arial";
        ctx.fillText(this.text, this.posx, this.posy);
    }

}

function nextturn() {
    activeplayer = 1-activeplayer;

    selectX = -1
    selectY = -1
    tgtY = -1
    tgtX = -1

    if (activeplayer == 0) {
        turntxt.text = "Player 1's Turn"
        turnnumber++
        statustxt.text = "Turn " + (turnnumber+1) + ": Combat"
    }
    else {
        turntxt.text = "Player 2's Turn"
    }
}

function fire() {
    if (gamebuttons[1-activeplayer][tgtX][tgtY].unitID != "") {
        alert("HIT!")
        gamebuttons[1-activeplayer][tgtX][tgtY].revealed = true

    }
    else {
        alert("MISS!")
        gamebuttons[1-activeplayer][tgtX][tgtY].color = "white"
    }
}


class Shop {

    
}


class ShopItem extends Component {

    constructor(w, h, x, y, text, color, textcolor, unit) {
        super(w, h, color, x, y);
        this.text = text;
        this.textcolor = textcolor
        this.unitID = unit
    }

    update() {
        var ctx = gameboard.context;

        if (mouseX > this.posx && mouseX < this.posx+this.width && mouseY > this.posy && mouseY < this.posy+this.height) {
            ctx.fillStyle = "white"
        }
        else if (selectedUNIT == this.unitID) {
            ctx.fillStyle = "green"
        }
        else {
            ctx.fillStyle = this.color
        }
    
        ctx.fillRect(this.posx, this.posy, this.width, this.height)
        ctx.drawImage(document.getElementById(this.unitID), this.posx, this.posy, this.height, this.height)
        ctx.fillStyle = this.textcolor
        ctx.font = "12px Arial";
        ctx.fillText(this.text, this.posx+this.width/2, this.posy + this.height*2/3);
    }

    click() {

        if (mouseX > this.posx && mouseX < this.posx+this.width && mouseY > this.posy && mouseY < this.posy+this.height) {
            selectedUNIT = this.unitID
        }
        
    }

}
