from flask import Flask, request, render_template

app = Flask(__name__)

name = ""

@app.route('/')
def index():
    return render_template('game.html')

@app.route('/play')
def play():
    global name
    name = request.args.get('username')
    print(name)
    return "put name here"


@app.route('/move')
def move():
    name = request.args.get('msg')
    print(name)
    return name


if __name__ == '__main__':
    app.run(host='0.0.0.0')
