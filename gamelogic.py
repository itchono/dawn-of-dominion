# Dawn of Dominion Game Logic
import os
import json
import base64
import logging

# SET UP LOGGER
gamelogger = logging.getLogger(__name__)
gamelogger.setLevel(logging.INFO)
c_handler = logging.StreamHandler()
c_handler.setLevel(logging.INFO)
gamelogger.addHandler(c_handler)

# LOAD ASSETS
_, unitnames, _ = next(os.walk("static/units"))
units: list = []
sprites = {}

for unit in unitnames:
    try:
        with open(f"static/units/{unit}/{unit}.json", "rb") as f:
            unitdata = json.load(f)
            try:
                with open(f"static/units/{unit}/{unitdata['sprite_location']}", "rb") as f:
                    sprites[unitdata["id"]] = base64.b64encode(f.read()).decode("utf-8")
            except OSError as e:
                gamelogger.exception(
                    f"Could not read sprite for: {unit}", exc_info=e)            

            units.append(unitdata)
    except OSError as e:
        gamelogger.exception(f"Could not read unit: {unit}", exc_info=e)

gamelogger.info(f"{len(units)} units loaded.")

# LOAD MAPS
with open("static/gamedata.json", "rb") as f:
    mapdata = json.load(f)


def process_move(movedata: dict) -> str:
    buttons = movedata["buttons"]
    for i in range(0, 2):
        for x in range(len(buttons[0])):
            for y in range(len(buttons[0])):
                if buttons[i][x][y]["data"]["unit"]:
                    buttons[i][x][y]["data"]["unit"]["CHP"] -= 5
    return json.dumps(movedata)
