from flask import Flask, request, render_template
from gamelogic import units, mapdata, sprites, upgrades, process_move
from sessionmanager import Session, sessions, get_session

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('splash.html')


@app.route('/play')
def play():
    curr_session = Session()
    sessions.append(curr_session)
    print(sessions)
    return render_template('game.html',
                           unitdata=units,
                           upgradedata=upgrades,
                           mapdata=mapdata,
                           spritemap=sprites,
                           id=curr_session.id)


@app.route('/gameover')
def gameover():
    id = int(request.args.get('id'))
    return render_template('gameover.html', winner=get_session(id).winner + 1)


@app.route('/move', methods=["POST"])
def move():
    movedata = request.json
    return process_move(movedata, get_session(movedata["id"]))


if __name__ == '__main__':
    app.run(host='0.0.0.0')
