from .gamelogic import Game
# Session Manager


class Session():
    # Session manager for Game

    def __init__(self) -> None:
        self.game: Game = Game()
        
        pass