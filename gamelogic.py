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

for unit in unitnames:
    try:
        with open(f"static/units/{unit}/{unit}.json", "rb") as f:
            unitdata = json.load(f)

            try:
                with open(f"static/units/{unit}/{unitdata['sprite_location']}", "rb") as f:
                    unitdata["sprite"] = base64.b64encode(f.read()).decode("utf-8")
            except OSError as e:
                gamelogger.exception(
                    f"Could not read sprite for: {unit}", exc_info=e)            

            units.append(unitdata)
    except OSError as e:
        gamelogger.exception(f"Could not read unit: {unit}", exc_info=e)

gamelogger.info(f"{len(units)} units loaded.")


class Game:
    # Primary game object 

    def __init__(self) -> None:
        pass
