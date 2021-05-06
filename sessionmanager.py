# Session Manager

sessions = []

GAMECOUNT = 0

class Game:
    # Primary game object 

    def __init__(self) -> None:
        print("Started new game with ID")
        pass




class Session():
    # Session manager for Game

    def __init__(self) -> None:
        global GAMECOUNT
        self.id = GAMECOUNT
        GAMECOUNT += 1

        self.game: Game = Game()

        print(f"Started new session with id {self.id}")
        pass