class Gameboard {
    constructor() {
        this.canvas = document.createElement("canvas")
        this.canvas.width = window.innerWidth * BOARD_SIZE_FACTOR;
        this.canvas.height = window.innerHeight * BOARD_SIZE_FACTOR;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]); // put the canvas into our document
        this.interval = setInterval(draw, 20); // creates a routine to run the draw function
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height); // clears the canvas for redraw
    }

}

class Component {
    constructor(width, height, color, x, y) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.color = color;
    }

    update() {
        var ctx = gameboard.context;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Gamebutton extends Component {
    constructor(width, height, color, x, y, team) {
        super(width, height, color, x, y);
        this.team = team;
    }
    update() {
        
        var ctx = gameboard.context;
        

        if (mouseX > this.x && mouseX < this.x+this.width && mouseY > this.y && mouseY < this.y+this.height) {
            
            ctx.fillStyle = "gold"
        }
        else{
            ctx.fillStyle = this.color;
        }
        
        ctx.fillRect(this.x, this.y, this.width, this.height);
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
        ctx.fillText(this.text, this.x, this.y);
    }

}