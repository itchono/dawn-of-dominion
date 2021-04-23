from flask import Flask, request, render_template
from gamelogic import units

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('splash.html')


@app.route('/play')
def play():
    return render_template('game.html', gamedata=units)


@app.route('/move', methods=["POST"])
def move():
    movedata = request.json
    movedata["verified"] = True
    print(movedata)
    return movedata


if __name__ == '__main__':
    app.run(host='0.0.0.0')
