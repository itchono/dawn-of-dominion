class Gameboard {
    constructor() {
        this.canvas = document.createElement("canvas")
        this.canvas.width = window.innerWidth * BOARD_SIZE_FACTOR;
        this.canvas.height = window.innerHeight * BOARD_SIZE_FACTOR;
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
}

class Gamebutton extends Component {
    constructor(w, h, color, indx, indy, team) {
        super(w, h, color, 0, 0);
        this.team = team;
        this.indx = indx;
        this.indy = indy;

        this.state = "empty"
    }
    update() {
        
        var ctx = gameboard.context;
        

        if (mouseX > this.posx && mouseX < this.posx+this.width && mouseY > this.posy && mouseY < this.posy+this.height) {
            ctx.fillStyle = "gold"
        }
        else if (this.state == "clicked"){
            ctx.fillStyle = TEAM_COLOURS[Math.abs(this.team-activeplayer)]
        }
        else {
            ctx.fillStyle = this.color;
        }
        
        ctx.fillRect(this.posx, 
                    this.posy, 
                    this.width, 
                    this.height);
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
        if (this.state == "empty") {
            this.state = "clicked"
        }
        else {
            this.state = "empty"
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
        ctx.font = "30px Roboto";
        ctx.fillText(this.text, this.posx, this.posy);
    }

}