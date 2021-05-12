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

STANDARD_FIELDS = ["name",
                   "id",
                   "description",
                   "cost",
                   "ATK",
                   "DEF",
                   "CHP",
                   "MHP",
                   "TER",
                   "sprite_location"]


# LOAD ASSETS
_, unitnames, _ = next(os.walk("static/units"))
units: list = []
sprites = {}

for unit in unitnames:
    try:
        with open(f"static/units/{unit}/{unit}.json", "rb") as f:
            unitdata: dict = json.load(f)

            # Validate unit
            for field in STANDARD_FIELDS:
                try:
                    assert field in unitdata.keys()
                except AssertionError:
                    gamelogger.exception(
                        f"Unit {unit} is missing field: {field}", exc_info=e) 

            # Read sprites
            try:
                with open(f"static/units/{unit}/{unitdata['sprite_location']}", "rb") as f:
                    sprites[unitdata["id"]] = base64.b64encode(f.read()).decode("utf-8")
            except OSError as e:
                gamelogger.exception(
                    f"Could not read sprite for: {unit}", exc_info=e)
            
            if all(field in unitdata.keys() for field in ["multiX", "multiY"]):
                # Multi-grid unit

                for i in range(unitdata["multiX"] * unitdata["multiY"]):
                    try:
                        ind_dot = unitdata['sprite_location'].index(".")

                        with open(f"static/units/{unit}/{unitdata['sprite_location'][:ind_dot]}{i+1}{unitdata['sprite_location'][ind_dot:]}", "rb") as f:
                            sprites[unitdata["id"] + str(i+1)] = base64.b64encode(f.read()).decode("utf-8")
                    except OSError as e:
                        gamelogger.exception(
                            f"Could not read multi-sprite for: {unit}-{i+1}", exc_info=e)

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
                    print("I see a unit", buttons[i][x][y]["data"]["unit"]["id"])
    return json.dumps(movedata)
