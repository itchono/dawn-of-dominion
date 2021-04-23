function clicknextturn() {

    function reqListener () {
        alert("Server says: " + this.responseText)
    }
    
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open("POST", "/move");
    oReq.setRequestHeader('Content-Type', 'application/json');
    oReq.send(JSON.stringify({
        yeet: "yee"
    }));

    activeplayer = 1-activeplayer;

    selectX = -1
    selectY = -1
    tgtY = -1
    tgtX = -1

    if (activeplayer == 0) {
        document.getElementById("turnindicator").innerHTML = "Player 1's Turn"
        turnnumber++
        document.getElementById("statusindicator").innerHTML = "Turn " + (turnnumber+1) + ": Combat"
    }
    else {
        document.getElementById("turnindicator").innerHTML = "Player 2's Turn"
    }
    if (turnnumber > 0) {
        // enable fire button
        document.getElementById("fire").removeAttribute("disabled")

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
    if (gameboard.buttons[1-activeplayer][tgtX][tgtY].unit) {
        alert("HIT!")
        gameboard.buttons[1-activeplayer][tgtX][tgtY].revealed = true

        gameboard.buttons[1-activeplayer][tgtX][tgtY].unit.CHP -= 10

    }
    else {
        alert("MISS!")
        gameboard.buttons[1-activeplayer][tgtX][tgtY].color = "white"
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