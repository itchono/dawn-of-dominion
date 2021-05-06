function clicknextturn() {

    function reqListener () {
        // on response
        var parseddata = JSON.parse(this.responseText)

        for (var grid = 0; grid < 2; grid++) {
            for (var x = 0; x < GRID_SIZE; x++) {
                for (var y = 0; y < GRID_SIZE; y++) { 
                    gameboard.buttons[grid][x][y].data = parseddata.buttons[grid][x][y].data
                }
            }
        } 
        
    }
    
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open("POST", "/move");
    oReq.setRequestHeader('Content-Type', 'application/json');
    oReq.send(JSON.stringify({
        yeet: "yee",
        buttons: gameboard.buttons
    }));

    activeplayer = 1-activeplayer;

    selectX = -1
    selectY = -1
    tgtY = -1
    tgtX = -1
    fired = false

    if (activeplayer == 0) {
        document.getElementById("turnindicator").innerHTML = "Player 1's Turn"
        turnnumber++
        document.getElementById("statusindicator").innerHTML = "Turn " + (turnnumber+1) + ": Combat"
    }
    else {
        document.getElementById("turnindicator").innerHTML = "Player 2's Turn"
    }
    if (turnnumber > 0) {

        if (activeplayer === 0) {
            document.getElementById("doneplacing").setAttribute("hidden", "true")
        }

    } else {
        // enable done placing button
        document.getElementById("shop").removeAttribute("disabled")
        document.getElementById("doneplacing").removeAttribute("disabled")
    }

    document.getElementById("nextturn").setAttribute("disabled", "true")
}

function clickfire() {
    fired = true
    if (gameboard.buttons[1-activeplayer][tgtX][tgtY].data.unit) {
        gameboard.buttons[1-activeplayer][tgtX][tgtY].data.revealed = true

        if (gameboard.buttons[activeplayer][selectX][selectY].data.unit) {
            var amount = gameboard.buttons[1-activeplayer][tgtX][tgtY].damage(gameboard.buttons[activeplayer][selectX][selectY].data.unit)
            document.getElementById("statusindicator").innerHTML = "Shot hit for " + amount + " damage!"
        }
        
    }
    else {
        document.getElementById("statusindicator").innerHTML = "Shot Missed."
        gameboard.buttons[1-activeplayer][tgtX][tgtY].data.state = "missed"
    }

    document.getElementById("nextturn").removeAttribute("disabled")
    document.getElementById("fire").setAttribute("disabled", "true")
}

function clickshop() {
    showshop = !showshop

    if (!showshop) {
        shop.selectedUNIT = null
    }

}

function clickdoneplacing() {
    showshop = false
    shop.selectedUNIT = null


    document.getElementById("nextturn").removeAttribute("disabled")

    // remove done placing
    document.getElementById("doneplacing").setAttribute("disabled", "true")

    document.getElementById("shop").setAttribute("disabled", "true")
}