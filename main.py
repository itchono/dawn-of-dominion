from flask import Flask, request, render_template
from gamelogic import units, mapdata, sprites, process_move
from sessionmanager import Session, sessions

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('splash.html')


@app.route('/play')
def play():
    sessions.append(Session())
    return render_template('game.html', unitdata=units, mapdata=mapdata, spritemap=sprites)


@app.route('/move', methods=["POST"])
def move():
    movedata = request.json
    movedata["verified"] = True
    return process_move(movedata)


if __name__ == '__main__':
    app.run(host='0.0.0.0')
